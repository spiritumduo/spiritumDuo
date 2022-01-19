from ariadne.objects import ObjectType
from dataloaders import MilestoneTypeLoader, MilestoneByReferenceIdFromIELoader, DecisionPointLoader
from datetime import datetime
MilestoneObjectType = ObjectType("Milestone")

@MilestoneObjectType.field("decisionPoint")
async def resolver(obj=None, info=None, *_):
    record=await DecisionPointLoader.load_from_id(context=info.context, id=obj.decision_point_id)
    return record.decision_point_id

@MilestoneObjectType.field("milestoneType")
async def resolver(obj=None, info=None, *_):
    return await MilestoneTypeLoader.load_from_id(context=info.context, id=obj.milestone_type_id)

@MilestoneObjectType.field("internalCurrentState")
async def resolver(obj=None, info=None, *_):
    return obj.current_state

@MilestoneObjectType.field("internalAddedAt")
async def resolver(obj=None, info=None, *_):
    return obj.added_at

@MilestoneObjectType.field("internalUpdatedAt")
async def resolver(obj=None, info=None, *_):
    return obj.updated_at




@MilestoneObjectType.field("currentState")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return record.current_state

@MilestoneObjectType.field("addedAt")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return datetime.strptime(record.added_at, "%Y-%m-%dT%H:%M:%S.%f")

@MilestoneObjectType.field("updatedAt")
async def resolver(obj=None, info=None, *_):
    record=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.reference_id)
    return datetime.strptime(record.updated_at, "%Y-%m-%dT%H:%M:%S.%f")
