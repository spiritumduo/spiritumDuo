from models import Patient
from SdTypes import MilestoneState
from dataloaders import OnPathwayByIdLoader, PatientByIdLoader
from dependency_injector.wiring import Provide, inject
from containers import SDContainer
from trustadapter.trustadapter import TrustAdapter, TestResultRequest_IE
from models import Milestone

@inject
async def ImportMilestone(
    context = None,
    on_pathway_id:int = None,
    milestone_type_id:int = None,
    description:str = None,
    current_state:MilestoneState = None,    
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    """
    Creates a milestone object in local and external databases

    Keyword arguments:
        context (dict): the current request context
        on_pathway_id (int): the ID of the `OnPathway` instance the newly created Milestone is to be linked to
        milestone_type_id (int): the ID of the `MilestoneType`
        description (str): the description/result of the request
        current_state (MilestoneState): the current state of the milestone (used for data creation scripts to import data)
        
    Returns:
        Milestone: newly created milestone object
    """
    patient_id=(await OnPathwayByIdLoader.load_from_id(context=context, id=int(on_pathway_id))).patient_id
    patient:Patient = await PatientByIdLoader.load_from_id(context=context, id=int(patient_id))

    testResult=await trust_adapter.create_test_result(
        TestResultRequest_IE(
            type_id=milestone_type_id,
            description=description,
            current_state=current_state,
            hospital_number=patient.hospital_number
        ), auth_token=context['request'].cookies['SDSESSION']
    )
    
    return await Milestone.create(
        on_pathway_id=int(on_pathway_id),
        current_state=current_state,
        milestone_type_id=int(milestone_type_id),
        test_result_reference_id=str(testResult.id)
    )