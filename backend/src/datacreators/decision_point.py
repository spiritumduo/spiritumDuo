from sqlalchemy import desc
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
from SdTypes import ClinicalRequestState, DecisionTypes
from typing import List, Dict, Union
from containers import SDContainer
from trustadapter.trustadapter import TestResultRequest_IE, TrustAdapter
from dependency_injector.wiring import Provide, inject
from common import (
    DecisionPointPayload,
    MutationUserErrorHandler,
    UserDoesNotHavePathwayPermission
)


class UserDoesNotOwnLock(Exception):
    """
    This is raised when the user attempts an
    operation whilst not owning the appropriate
    OnPathway lock
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
    as the decision point's OnPathway object.
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
    from_mdt_id: int = None,
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
) -> DecisionPointPayload:
    """
    Creates a decision point object in local and external databases

    :param context: the current request context
    :param on_pathway_id: the ID of the `OnPathway` instance the newly created
        DecisionPoint is to be linked to
    :param clinician_id: the ID of the `User` object the newly created
        DecisionPoint is to be linked to
    :param decision_type: the type of the decision point
    :param clinic_history: the clinical history to be linked to the decision
        point
    :param comorbidities: the comorbidities to be linked to the decision point
    :param clinical_request_resolutions: a list of previous clinical_requests
        this decision point will acknowledge
    :param clinical_request_requests: a list of clinical_requests this
        decision point will request
    :param mdt a list of data pertaining to the MDT the pt should be added to
    :param from_mdt_id: the ID of the MDT this decision point is created from

    :return: DecisionPointPayload object

    :raise TypeError: invalid arguments
    :raise UserDoesNotHavePathwayPermission: user does not have pathway
        permission
    :raise UserDoesNotOwnLock: user does not own lock on DecisionPoint object
    :raise DecisionPointMdtMismatchException: MDT and DecisionPoint not on
        same Pathway
    :raise ClinicalRequestTypeIdNotOnPathway: ClinicalRequestType and
        DecisionPoint not on same Pathway
    """

    if context is None:
        raise TypeError("context cannot be None type")
    if on_pathway_id is None:
        raise TypeError("on_pathway_id cannot be None type")
    if clinician_id is None:
        raise TypeError("clinician_id cannot be None type")
    if decision_type is None:
        raise TypeError("decision_type cannot be None type")
    if clinic_history is None:
        raise TypeError("clinic_history cannot be None type")
    if comorbidities is None:
        raise TypeError("comorbidities cannot be None type")

    errors = MutationUserErrorHandler()

    await trust_adapter.test_connection(
        auth_token=context['request'].cookies['SDSESSION']
    )

    on_pathway_id = int(on_pathway_id)
    clinician_id = int(clinician_id)

    on_pathway = await OnPathwayByIdLoader.load_from_id(
        context=context,
        id=on_pathway_id
    )

    pathway = await PathwayByIdLoader.load_from_id(
        context, on_pathway.pathway_id)

    async with db.acquire(reuse=False) as conn:
        async with db.transaction():
            user_has_pathway_permission: Union[UserPathway, None] = await conn\
                .one_or_none(
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

        if mdt is not None:
            mdt_obj: MDT = await MDT.get(int(mdt['id']))

            if mdt_obj.pathway_id != on_pathway.pathway_id:
                raise DecisionPointMdtMismatchException()

            patient_has_on_mdt = await conn.one_or_none(
                MDT.join(OnMdt, MDT.id == OnMdt.mdt_id).select()
                .where(OnMdt.patient_id == on_pathway.patient_id)
                .where(MDT.pathway_id == on_pathway.pathway_id)
                .where(MDT.id == mdt_obj.id))

            if patient_has_on_mdt is not None:
                errors.addError(
                    'mdt',
                    'This patient is already on the MDT specified'
                )
                return DecisionPointPayload(
                    user_errors=errors.errorList,
                )

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

        if from_mdt_id is not None:
            mdt_clinical_request: ClinicalRequest = await conn.one_or_none(
                ClinicalRequest.join(
                    OnMdt, ClinicalRequest.id == OnMdt.clinical_request_id
                ).join(
                    MDT, MDT.id == OnMdt.mdt_id
                ).select().where(
                    MDT.id == int(from_mdt_id)
                ).where(
                    OnMdt.patient_id == on_pathway.patient_id
                ).execution_options(loader=ClinicalRequest)
            )

            if mdt_clinical_request is None:
                raise TypeError(
                    "ClinicalRequest cannot be None type (not found); "
                    f"MDT: {from_mdt_id}; "
                    f"Patient: {on_pathway.patient_id}"
                )

            if mdt_clinical_request.fwd_decision_point_id is None:
                await mdt_clinical_request.update(
                    fwd_decision_point_id=decision_point.id,
                    current_state=ClinicalRequestState.COMPLETED
                ).apply()

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

                if str(milestone_type.id) not in \
                        valid_clinical_request_type_ids:
                    raise ClinicalRequestTypeIdNotOnPathway(milestone_type.id)

                clinical_request_request = TestResultRequest_IE()
                clinical_request_request.type_id = milestone_type.id
                clinical_request_request.hospital_number = \
                    patient.hospital_number
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
                    clinical_request_type_id=int(
                        clinical_request_request.type_id),
                    **kwargs_clinical_request
                ).create()

                if milestone_type.is_mdt:
                    mdt_obj: MDT = await MDT.get(int(mdt['id']))

                    if mdt_obj.pathway_id != on_pathway.pathway_id:
                        raise DecisionPointMdtMismatchException()

                    highest_order_on_mdt = await OnMdt.query \
                        .where(OnMdt.mdt_id == mdt_obj.id) \
                        .order_by(desc(OnMdt.order)) \
                        .gino.first()

                    if highest_order_on_mdt is not None:
                        new_order = highest_order_on_mdt.order + 1
                    else:
                        new_order = 0

                    await OnMdt.create(
                        mdt_id=mdt_obj.id,
                        patient_id=on_pathway.patient_id,
                        user_id=context['request']['user'].id,
                        reason=mdt['reason'],
                        clinical_request_id=clinical_request.id,
                        order=new_order
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

        return DecisionPointPayload(
            decision_point=decision_point,
        )
