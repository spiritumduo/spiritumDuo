from ariadne.objects import ObjectType
from dataloaders import MilestoneTypeLoader, MilestoneByReferenceIdFromIELoader, DecisionPointLoader
from models import MilestoneType, Milestone
from SdTypes import MilestoneState
from datetime import datetime
MilestoneObjectType = ObjectType("Milestone")

@MilestoneObjectType.field("decisionPoint")
async def resolver(obj=None, info=None, *_):
    record=await DecisionPointLoader.load_from_id(context=info.context, id=obj.decision_point_id)
    return record.decision_point_id

@MilestoneObjectType.field("milestoneType")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return await MilestoneTypeLoader.load_from_id(context=info.context, id=record.milestone_type_id)

@MilestoneObjectType.field("currentState")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return MilestoneState[record.current_state]

@MilestoneObjectType.field("addedAt")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return record.updated_at

@MilestoneObjectType.field("updatedAt")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return record.updated_at
