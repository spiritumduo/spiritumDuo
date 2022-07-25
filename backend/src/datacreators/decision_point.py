from ctypes import Union
from dataloaders import (
    OnPathwayByIdLoader,
    PatientByIdLoader,
    ClinicalRequestTypeLoaderByPathwayId,
    ClinicalRequestTypeLoader,
    PathwayByIdLoader,
)
from models import (
    DecisionPoint,
    ClinicalRequest,
    OnPathway,
    ClinicalRequestType,
    Patient,
    UserPathway,
    OnMdt,
    MDT,
    db
)
from SdTypes import DecisionTypes
from typing import List, Dict
from containers import SDContainer
from trustadapter.trustadapter import TestResultRequest_IE, TrustAdapter
from dependency_injector.wiring import Provide, inject
from common import (
    DataCreatorInputErrors,
    UserDoesNotHavePathwayPermission
)


class UserDoesNotOwnLock(Exception):
    """
    This is raised when the user attempts to
    submit a decision point whilst not owning
    the OnPathway lock
    """


class ClinicalRequestTypeIdNotOnPathway(Exception):
    """
    This is raised when a clinical_request is added
    but does not exist in the link-relationship
    PathwayClinicalRequestType
    """


class DecisionPointMdtMismatchException(Exception):
    """
    This is raised when an MDT is added using the `createDecisionPoint`
    mutation, however the MDT specified is not on the same pathway
    as the decision point's OnPathway object. If this is triggered, it
    could indicate tampering.
    """


@inject
async def CreateDecisionPoint(
    context: dict = None,
    on_pathway_id: int = None,
    clinician_id: int = None,
    decision_type: DecisionTypes = None,
    clinic_history: str = None,
    comorbidities: str = None,
    clinical_request_resolutions: List[int] = None,
    clinical_request_requests: List[Dict[str, int]] = None,
    mdt: Dict[str, str] = None,
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    """
    Creates a decision point object in local and external databases

    Keyword arguments:
        context (dict): the current request context
        on_pathway_id (int): the ID of the `OnPathway` instance the newly
            created DecisionPoint is to be linked to
        clinician_id (int): the ID of the `User` object the newly created
            DecisionPoint is to be linked to
        decision_type (DecisionTypes): the type of the decision point
        clinic_history (str): the clinical history to be linked to the
            decision point
        comorbidities (str): the comorbidities to be linked to the decision
            point
        clinical_request_resolutions (List[int]): a list of previous
            clinical_requests this decision point will acknowledge
        clinical_request_requests (List[Dict[str, int]]): a list of
            clinical_requests this decision point will request
        mdt (Dict[str, str]): a list of data pertaining to MDT creation
    Returns:
        DecisionPoint: newly created decision point object
    """
    errors = DataCreatorInputErrors()

    await trust_adapter.test_connection(
        auth_token=context['request'].cookies['SDSESSION']
    )

    if context is None:
        raise TypeError("Context provided is None")
    on_pathway_id = int(on_pathway_id)
    clinician_id = int(clinician_id)

    on_pathway = await OnPathwayByIdLoader.load_from_id(
        context=context,
        id=on_pathway_id
    )

    pathway = await PathwayByIdLoader.load_from_id(
        context, on_pathway.pathway_id)

    async with db.acquire(reuse=False) as conn:
        user_has_pathway_permission = await conn.one_or_none(
            UserPathway
            .query.where(UserPathway.user_id == clinician_id)
            .where(UserPathway.pathway_id == on_pathway.pathway_id)
        )

    if user_has_pathway_permission is None:
        raise UserDoesNotHavePathwayPermission(
            f"User ID: {clinician_id}"
            f"; Pathway ID: {on_pathway.pathway_id}"
        )

    if on_pathway.lock_user_id != clinician_id:
        raise UserDoesNotOwnLock()

    if mdt:
        mdt_obj: MDT = await MDT.get(int(mdt['id']))

        if mdt_obj.pathway_id != on_pathway.pathway_id:
            raise DecisionPointMdtMismatchException()

        async with db.acquire(reuse=False) as conn:
            patient_has_on_mdt = await conn.one_or_none(
                MDT.join(OnMdt, MDT.id == OnMdt.mdt_id).select()
                .where(OnMdt.patient_id == on_pathway.patient_id)
                .where(MDT.pathway_id == on_pathway.pathway_id)
            )
        if patient_has_on_mdt:
            errors.addError(
                'mdt',
                'This patient is already on the MDT specified'
            )
            return errors

    decision_point_details = {
        "on_pathway_id": on_pathway_id,
        "clinician_id": clinician_id,
        "decision_type": decision_type,
        "clinic_history": clinic_history,
        "comorbidities": comorbidities,
    }

    decision_point: DecisionPoint = await DecisionPoint.create(
        **decision_point_details
    )

    patient: Patient = await PatientByIdLoader.load_from_id(
        context=context,
        id=int(on_pathway.patient_id)
    )

    if clinical_request_requests is not None:
        pathwayId: int = on_pathway.pathway_id

        valid_clinical_request_types: Union[ClinicalRequestType, None] = \
            await ClinicalRequestTypeLoaderByPathwayId.load_from_id(
                    context, pathwayId)
        valid_clinical_request_type_ids = [
            str(mT.id) for mT in valid_clinical_request_types
        ]

        for request_input in clinical_request_requests:
            milestone_type: ClinicalRequestType = await \
                ClinicalRequestTypeLoader.load_from_id(
                    context, str(request_input['clinicalRequestTypeId'])
                )

            if str(milestone_type.id) not in valid_clinical_request_type_ids:
                raise ClinicalRequestTypeIdNotOnPathway(milestone_type.id)

            clinical_request_request = TestResultRequest_IE()
            clinical_request_request.type_id = milestone_type.id
            clinical_request_request.hospital_number = patient.hospital_number
            clinical_request_request.pathway_name = pathway.name

            test_result = None
            if not milestone_type.is_mdt:
                test_result = await trust_adapter.create_test_result(
                    clinical_request_request,
                    auth_token=context['request'].cookies['SDSESSION']
                )
            kwargs_clinical_request = {}

            if test_result is not None and test_result.id:
                kwargs_clinical_request = {
                    "test_result_reference_id": str(test_result.id)
                }

            clinical_request: ClinicalRequest = await ClinicalRequest(
                on_pathway_id=int(decision_point.on_pathway_id),
                decision_point_id=int(decision_point.id),
                clinical_request_type_id=int(clinical_request_request.type_id),
                **kwargs_clinical_request
            ).create()

            if milestone_type.is_mdt:
                await OnMdt.create(
                    mdt_id=mdt_obj.id,
                    patient_id=on_pathway.patient_id,
                    user_id=context['request']['user'].id,
                    reason=mdt['reason'],
                    clinical_request_id=clinical_request.id
                )

            clinical_request_type: ClinicalRequestType = await \
                ClinicalRequestType.get(
                    int(clinical_request_request.type_id)
                )
            if clinical_request_type.is_discharge:
                await OnPathway.update\
                    .where(OnPathway.id == on_pathway_id)\
                    .values(is_discharged=True)\
                    .gino.scalar()

    if clinical_request_resolutions is not None:
        for clinical_request_id in clinical_request_resolutions:
            await ClinicalRequest.update.values(
                fwd_decision_point_id=int(decision_point.id)
            ).where(ClinicalRequest.id == int(clinical_request_id))\
                .gino.status()

    await OnPathway.update\
        .where(OnPathway.id == on_pathway_id)\
        .where(OnPathway.under_care_of_id.is_(None))\
        .values(under_care_of_id=context['request']['user'].id)\
        .gino.scalar()

    return decision_point
