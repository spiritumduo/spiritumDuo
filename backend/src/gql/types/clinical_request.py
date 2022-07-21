from ariadne.objects import ObjectType
from SdTypes import ClinicalRequestState
from dataloaders import (
    ClinicalRequestTypeLoader,
    TestResultByReferenceIdFromIELoader,
    DecisionPointLoader,
    OnPathwayByIdLoader
)
from models import ClinicalRequest
from graphql.type import GraphQLResolveInfo

ClinicalRequestObjectType = ObjectType("ClinicalRequest")


@ClinicalRequestObjectType.field("decisionPoint")
async def resolve_decision_point(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return await DecisionPointLoader.load_from_id(
        context=info.context, id=obj.decision_point_id)


@ClinicalRequestObjectType.field("forwardDecisionPoint")
async def resolve_forward_decision_point(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return await DecisionPointLoader.load_from_id(
        context=info.context, id=obj.fwd_decision_point_id)


@ClinicalRequestObjectType.field("onPathway")
async def resolve_on_pathway(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return await OnPathwayByIdLoader.load_from_id(
        context=info.context, id=obj.on_pathway_id)


@ClinicalRequestObjectType.field("clinicalRequestType")
async def resolve_clinical_request_type(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return await ClinicalRequestTypeLoader.load_from_id(
        context=info.context, id=obj.clinical_request_type_id)


@ClinicalRequestObjectType.field("testResult")
async def resolve_test_result(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    if (
        obj.current_state == ClinicalRequestState.COMPLETED
        and obj.test_result_reference_id is not None
    ):
        return await TestResultByReferenceIdFromIELoader.load_from_id(
            context=info.context, id=obj.test_result_reference_id)
    else:
        return None


@ClinicalRequestObjectType.field("currentState")
async def resolve_current_state(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return obj.current_state.value


@ClinicalRequestObjectType.field("addedAt")
async def resolve_added_at(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return obj.added_at


@ClinicalRequestObjectType.field("updatedAt")
async def resolve_updated_at(
    obj: ClinicalRequest = None, info: GraphQLResolveInfo = None, *_
):
    return obj.updated_at
