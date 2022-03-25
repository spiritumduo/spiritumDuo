from ariadne.objects import ObjectType
from SdTypes import MilestoneState
from dataloaders import (
    MilestoneTypeLoader,
    TestResultByReferenceIdFromIELoader,
    DecisionPointLoader,
    OnPathwayByIdLoader
)
from models import Milestone
from graphql.type import GraphQLResolveInfo

MilestoneObjectType = ObjectType("Milestone")


@MilestoneObjectType.field("decisionPoint")
async def resolve_decision_point(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return await DecisionPointLoader.load_from_id(
        context=info.context, id=obj.decision_point_id)


@MilestoneObjectType.field("forwardDecisionPoint")
async def resolve_forward_decision_point(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return await DecisionPointLoader.load_from_id(
        context=info.context, id=obj.fwd_decision_point_id)


@MilestoneObjectType.field("onPathway")
async def resolve_on_pathway(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return await OnPathwayByIdLoader.load_from_id(
        context=info.context, id=obj.on_pathway_id)


@MilestoneObjectType.field("milestoneType")
async def resolve_milestone_type(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return await MilestoneTypeLoader.load_from_id(
        context=info.context, id=obj.milestone_type_id)


@MilestoneObjectType.field("testResult")
async def resolve_test_result(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    if obj.current_state == MilestoneState.COMPLETED:
        return await TestResultByReferenceIdFromIELoader.load_from_id(
            context=info.context, id=obj.test_result_reference_id)
    else:
        return None


@MilestoneObjectType.field("currentState")
async def resolve_current_state(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return obj.current_state.value


@MilestoneObjectType.field("addedAt")
async def resolve_added_at(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return obj.added_at


@MilestoneObjectType.field("updatedAt")
async def resolve_updated_at(
    obj: Milestone = None, info: GraphQLResolveInfo = None, *_
):
    return obj.updated_at
