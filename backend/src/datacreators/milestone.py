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
    milestoneType:MilestoneType=await MilestoneType.get(int(milestoneTypeId))
    testResult=await trustAdapter.create_test_result(
        TestResultRequest_IE(
            type_id=milestoneTypeId,
            description=description,
            current_state=currentState,
        ), auth_token=context['request'].cookies['SDSESSION']
    )
    milestone=await Milestone.create(
        on_pathway_id=int(onPathwayId),
        current_state=currentState,
        milestone_type_id=int(milestoneTypeId),
        test_result_reference_id=str(testResult.id)
    )
    
    return{
        "id": milestone.id,
        "on_pathway_id": milestone.on_pathway_id,
        "decision_point_id": milestone.decision_point_id,
        "fwd_decision_point_id": milestone.fwd_decision_point_id,
        "test_result_reference_id": milestone.test_result_reference_id,
        "current_state": milestone.current_state,
        "milestone_type_id": milestone.milestone_type_id,
        "added_at": milestone.added_at,
        "updated_at": milestone.updated_at,
    }