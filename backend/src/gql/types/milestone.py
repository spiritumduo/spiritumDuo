from ariadne.objects import ObjectType
from dataloaders import MilestoneTypeLoader
from models import MilestoneType, Milestone

MilestoneObjectType = ObjectType("Milestone")

@MilestoneObjectType.field("milestoneType")
async def resolve_milestone_type(obj: Milestone=None, info=None, *_) -> MilestoneType:
    return await MilestoneTypeLoader.load_from_id(context=info.context, id=obj.milestone_type_id)

