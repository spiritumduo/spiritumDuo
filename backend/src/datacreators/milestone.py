from sqlalchemy import desc
from models import User
from SdTypes import MilestoneState
from dependency_injector.wiring import Provide, inject
from containers import SDContainer
from trustadapter.trustadapter import TrustAdapter, TestResultRequest_IE
from models import Milestone, MilestoneType

@inject
async def ImportMilestone(
    context = None,
    onPathwayId:int = None,
    milestoneTypeId:int = None,
    description:str = None,
    currentState:MilestoneState = None,    
    trustAdapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
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
    testResult=await trust_adapter.create_test_result(
        TestResultRequest_IE(
            type_id=milestoneTypeId,
            description=description,
            current_state=currentState,
        ), auth_token=context['request'].cookies['SDSESSION']
    )
    
    return await Milestone.create(
        on_pathway_id=int(onPathwayId),
        current_state=currentState,
        milestone_type_id=int(milestoneTypeId),
        test_result_reference_id=str(testResult.id)
    )