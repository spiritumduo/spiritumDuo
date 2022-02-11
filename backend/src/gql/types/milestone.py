from ariadne.objects import ObjectType

from SdTypes import MilestoneState
from dataloaders import MilestoneTypeLoader, TestResultByReferenceIdFromIELoader, DecisionPointLoader, OnPathwayByIdLoader
from models import Milestone
MilestoneObjectType = ObjectType("Milestone")

@MilestoneObjectType.field("decisionPoint")
async def resolver(obj:Milestone=None, info=None, *_):
    return await DecisionPointLoader.load_from_id(context=info.context, id=obj.decision_point_id)

@MilestoneObjectType.field("forwardDecisionPoint")
async def resolver(obj:Milestone=None, info=None, *_):
    return await DecisionPointLoader.load_from_id(context=info.context, id=obj.fwd_decision_point_id)

@MilestoneObjectType.field("onPathway")
async def resolver(obj:Milestone=None, info=None, *_):
    return await OnPathwayByIdLoader.load_from_id(context=info.context, id=obj.on_pathway_id)

@MilestoneObjectType.field("milestoneType")
async def resolver(obj:Milestone=None, info=None, *_):
    return await MilestoneTypeLoader.load_from_id(context=info.context, id=obj.milestone_type_id)

@MilestoneObjectType.field("testResult")
async def resolver(obj:Milestone=None, info=None, *_):
    if obj.current_state == MilestoneState.COMPLETED:
        return await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.test_result_reference_id)
    else:
        return None

@MilestoneObjectType.field("currentState")
async def resolver(obj:Milestone=None, info=None, *_):
    return obj.current_state

@MilestoneObjectType.field("addedAt")
async def resolver(obj:Milestone=None, info=None, *_):
    return obj.added_at

@MilestoneObjectType.field("updatedAt")
async def resolver(obj:Milestone=None, info=None, *_):
    return obj.updated_at