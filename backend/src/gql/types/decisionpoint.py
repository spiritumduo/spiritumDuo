from ariadne.objects import ObjectType
from dataloaders import UserByIdLoader, OnPathwayByIdLoader
from dataloaders.milestone import MilestoneByDecisionPointLoader, MilestoneByReferenceIdFromIELoader
from models import Milestone

DecisionPointObjectType=ObjectType("DecisionPoint")

@DecisionPointObjectType.field("clinician")
async def resolve_on_pathway_clinician(obj=None, info=None, *_):
    return await UserByIdLoader.load_from_id(context=info.context, id=obj.clinician_id)

@DecisionPointObjectType.field("onPathway")
async def resolve_on_pathway_pathway(obj=None, info=None, *_):
    return await OnPathwayByIdLoader.load_from_id(context=info.context, id=obj.on_pathway_id)


@DecisionPointObjectType.field("milestones")
async def resolve_decision_point_milestones(obj=None, info=None, *_):
    query = Milestone.query.where(Milestone.decision_point_id == obj.id)
    # TODO: added another dataloader to get by decision point ID
    # tieMilestone=await MilestoneByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)
    # query.order_by(tieMilestone.added_at)
    query.order_by(Milestone.id.desc())
    async with info.context['db'].acquire(reuse=False) as conn:
        milestones = await conn.all(query)
        for m in milestones:
            MilestoneByDecisionPointLoader.prime_with_context(info.context, m.id, m)
        return milestones