from dataloaders import OnPathwayByIdLoader, PatientByIdLoader
from models import DecisionPoint, Milestone, OnPathway, MilestoneType, Patient
from SdTypes import DecisionTypes
from typing import List, Dict
from containers import SDContainer
from trustadapter.trustadapter import TestResultRequest_IE, TrustAdapter
from dependency_injector.wiring import Provide, inject
from datetime import datetime
from common import ReferencedItemDoesNotExistError


class UserDoesNotOwnLock(Exception):
    """
    This is raised when the user attempts to
    submit a decision point whilst not owning
    the OnPathway lock
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
    if on_pathway.lock_user_id != clinician_id:
        raise UserDoesNotOwnLock()

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
    patient_id = (await OnPathwayByIdLoader.load_from_id(
        context=context,
        id=int(on_pathway_id))
    ).patient_id
    patient: Patient = await PatientByIdLoader.load_from_id(
        context=context,
        id=int(patient_id)
    )
    if milestone_requests is not None:
        for requestInput in milestone_requests:
            testResultRequest = TestResultRequest_IE()
            testResultRequest.added_at = datetime.now()
            testResultRequest.updated_at = datetime.now()
            testResultRequest.type_id = requestInput['milestoneTypeId']
            testResultRequest.hospital_number = patient.hospital_number

            # TODO: batch these
            if "currentState" in requestInput:
                testResultRequest.current_state = requestInput['currentState']
            if "addedAt" in requestInput:
                testResultRequest.added_at = requestInput['addedAt']
            if "updatedAt" in requestInput:
                testResultRequest.updated_at = requestInput['updatedAt']

            testResult = await trust_adapter.create_test_result(
                testResultRequest,
                auth_token=context['request'].cookies['SDSESSION']
            )

            await Milestone(
                on_pathway_id=int(_decisionPoint.on_pathway_id),
                decision_point_id=int(_decisionPoint.id),
                milestone_type_id=int(testResultRequest.type_id),
                test_result_reference_id=str(testResult.id),
                added_at=testResultRequest.added_at,
                updated_at=testResultRequest.updated_at
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
