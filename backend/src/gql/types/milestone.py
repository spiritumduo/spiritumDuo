from ariadne.objects import ObjectType
from dataloaders import MilestoneTypeLoader
from models import MilestoneType, Milestone
from SDIE import IntegrationEngine
MilestoneObjectType = ObjectType("Milestone")

# @MilestoneObjectType.field("milestoneType")
# async def resolve_milestone_type(obj: Milestone=None, info=None, *_) -> MilestoneType:
#     return await MilestoneTypeLoader.load_from_id(context=info.context, id=obj.milestone_type_id)

@MilestoneObjectType.field("trustData")
def resolve_decision_point_trust_data(obj: Milestone = None, info = None, *_):
    return IntegrationEngine(authToken=info.context['request'].cookies['SDSESSION']).load_milestone(obj.reference_id)