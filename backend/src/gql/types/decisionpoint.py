from ariadne.objects import ObjectType
from dataloaders import UserByIdLoader, OnPathwayByIdLoader
from dataloaders import MilestoneByDecisionPointLoader
from models import Milestone, DecisionPoint
from graphql.type import GraphQLResolveInfo
from typing import Union, List

DecisionPointObjectType=ObjectType("DecisionPoint")

@DecisionPointObjectType.field("clinician")
async def resolve_on_pathway_clinician(obj:DecisionPoint=None, info:GraphQLResolveInfo=None, *_):
    return await UserByIdLoader.load_from_id(context=info.context, id=obj.clinician_id)

@DecisionPointObjectType.field("onPathway")
async def resolve_on_pathway_pathway(obj:DecisionPoint=None, info:GraphQLResolveInfo=None, *_):
    return await OnPathwayByIdLoader.load_from_id(context=info.context, id=obj.on_pathway_id)

@DecisionPointObjectType.field("milestoneResolutions")
async def resolve_on_pathway_pathway(obj:DecisionPoint=None, info:GraphQLResolveInfo=None, *_):
    query = Milestone.query.where(Milestone.fwd_decision_point_id == obj.id)
    query.order_by(Milestone.id.desc())
    async with info.context['db'].acquire(reuse=False) as conn:
        milestones = await conn.all(query)
        for m in milestones:
            MilestoneByDecisionPointLoader.prime_with_context(info.context, m.id, m)
        return milestones

@DecisionPointObjectType.field("milestones")
async def resolve_decision_point_milestones(obj:DecisionPoint=None, info:GraphQLResolveInfo=None, *_):
    # TODO: added another dataloader to get by decision point ID
    # tieMilestone=await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)
    # query.order_by(tieMilestone.added_at)
    query = Milestone.query.where(Milestone.decision_point_id == obj.id)
    query.order_by(Milestone.added_at.desc())
    async with info.context['db'].acquire(reuse=False) as conn:
        milestones:Union[List[Milestone], None] = await conn.all(query)
        for milestone in milestones:
            MilestoneByDecisionPointLoader.prime_with_context(info.context, milestone.id, milestone)
        return milestones