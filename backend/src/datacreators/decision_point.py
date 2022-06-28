from ctypes import Union
from dataloaders import (
    OnPathwayByIdLoader,
    PatientByIdLoader,
    MilestoneTypeLoaderByPathwayId,
    PathwayByIdLoader,
    MilestoneTypeLoader
)
from models import (
    DecisionPoint,
    Milestone,
    OnPathway,
    MilestoneType,
    Patient,
    UserPathway,
    OnMdt,
    MDT
)
from SdTypes import DecisionTypes
from typing import List, Dict
from containers import SDContainer
from trustadapter.trustadapter import TestResultRequest_IE, TrustAdapter
from dependency_injector.wiring import Provide, inject
from datetime import datetime
from common import (
    ReferencedItemDoesNotExistError,
    UserDoesNotHavePathwayPermission
)


class UserDoesNotOwnLock(Exception):
    """
    This is raised when the user attempts to
    submit a decision point whilst not owning
    the OnPathway lock
    """


class MilestoneTypeIdNotOnPathway(Exception):
    """
    This is raised when a milestone is added
    but does not exist in the link-relationship
    PathwayMilestoneType
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
    added_at: datetime = None,
    milestone_resolutions: List[int] = None,
    milestone_requests: List[Dict[str, int]] = None,
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
        added_at (datetime): the date and time of creation of the decision
            point (used for data creation scripts to add previous data)
        milestone_resolutions (List[int]): a list of previous milestones this
            decision point will acknowledge
        milestone_requests (List[Dict[str, int]]): a list of milestones this
            decision point will request
    Returns:
        DecisionPoint: newly created decision point object
    """

    await trust_adapter.test_connection(
        auth_token=context['request'].cookies['SDSESSION']
    )

    if context is None:
        raise ReferencedItemDoesNotExistError("Context is not provided")
    on_pathway_id = int(on_pathway_id)
    clinician_id = int(clinician_id)

    on_pathway = await OnPathwayByIdLoader.load_from_id(
        context=context,
        id=on_pathway_id
    )

    pathway = await PathwayByIdLoader.load_from_id(
        context, on_pathway.pathway_id)

    userHasPathwayPermission: Union[UserPathway, None] = await UserPathway\
        .query.where(UserPathway.user_id == clinician_id)\
        .where(UserPathway.pathway_id == on_pathway.pathway_id)\
        .gino.one_or_none()

    if userHasPathwayPermission is None:
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

        # TODO: check if pt already has onmdt

        await OnMdt.create(
            mdt_id=mdt_obj.id,
            patient_id=on_pathway.patient_id,
            user_id=context['request']['user'].id
        )

    decision_point_details = {
        "on_pathway_id": on_pathway_id,
        "clinician_id": clinician_id,
        "decision_type": decision_type,
        "clinic_history": clinic_history,
        "comorbidities": comorbidities,
    }
    if added_at:
        decision_point_details['added_at'] = added_at

    _decisionPoint: DecisionPoint = await DecisionPoint.create(
        **decision_point_details
    )

    patient: Patient = await PatientByIdLoader.load_from_id(
        context=context,
        id=int(on_pathway.patient_id)
    )

    if milestone_requests is not None:
        pathwayId: int = on_pathway.pathway_id

        validMilestoneTypes: Union[MilestoneType, None] = \
            await MilestoneTypeLoaderByPathwayId.load_from_id(
                    context, pathwayId)
        validMilestoneTypeIds = [str(mT.id) for mT in validMilestoneTypes]

        for requestInput in milestone_requests:
            milestone_type: MilestoneType = await MilestoneTypeLoader.load_from_id(
                context, str(requestInput['milestoneTypeId']))

            if str(milestone_type.id) not in validMilestoneTypeIds:
                raise MilestoneTypeIdNotOnPathway(milestone_type.id)

            if not milestone_type.is_mdt:
                testResultRequest = TestResultRequest_IE()
                testResultRequest.type_id = milestone_type.id
                testResultRequest.hospital_number = patient.hospital_number
                testResultRequest.pathway_name = pathway.name

                testResult = await trust_adapter.create_test_result(
                    testResultRequest,
                    auth_token=context['request'].cookies['SDSESSION']
                )

                await Milestone(
                    on_pathway_id=int(_decisionPoint.on_pathway_id),
                    decision_point_id=int(_decisionPoint.id),
                    milestone_type_id=int(testResultRequest.type_id),
                    test_result_reference_id=str(testResult.id),
                ).create()

                milestone_type = await MilestoneType.get(
                    int(testResultRequest.type_id)
                )
                if milestone_type.is_discharge:
                    await OnPathway.update\
                        .where(OnPathway.id == on_pathway_id)\
                        .values(is_discharged=True)\
                        .gino.scalar()

    if milestone_resolutions is not None:
        for milestoneId in milestone_resolutions:
            await Milestone.update.values(
                fwd_decision_point_id=int(_decisionPoint.id)
            ).where(Milestone.id == int(milestoneId)).gino.status()

    await OnPathway.update\
        .where(OnPathway.id == on_pathway_id)\
        .where(OnPathway.under_care_of_id == None)\
        .values(under_care_of_id=context['request']['user'].id)\
        .gino.scalar()

    return _decisionPoint
