from ariadne.objects import ObjectType
from dataloaders import UserByIdLoader, OnPathwayByIdLoader
from dataloaders import ClinicalRequestByDecisionPointLoader
from models import ClinicalRequest, DecisionPoint
from graphql.type import GraphQLResolveInfo
from typing import Union, List

DecisionPointObjectType = ObjectType("DecisionPoint")


@DecisionPointObjectType.field("clinician")
async def resolve_on_pathway_clinician(
    obj: DecisionPoint = None, info: GraphQLResolveInfo = None, *_
):
    return await UserByIdLoader.load_from_id(
        context=info.context, id=obj.clinician_id)


@DecisionPointObjectType.field("onPathway")
async def resolve_on_pathway_pathway(
    obj: DecisionPoint = None, info: GraphQLResolveInfo = None, *_
):
    return await OnPathwayByIdLoader.load_from_id(
        context=info.context, id=obj.on_pathway_id)


@DecisionPointObjectType.field("clinicalRequestResolutions")
async def resolve_on_pathway_clinical_requestresolutions(
    obj: DecisionPoint = None, info: GraphQLResolveInfo = None, *_
):
    query = ClinicalRequest.query.where(ClinicalRequest.fwd_decision_point_id == obj.id)
    query.order_by(ClinicalRequest.id.desc())
    async with info.context['db'].acquire(reuse=False) as conn:
        clinical_requests = await conn.all(query)
        for m in clinical_requests:
            ClinicalRequestByDecisionPointLoader.prime_with_context(
                info.context, m.id, m)
        return clinical_requests


@DecisionPointObjectType.field("clinicalRequests")
async def resolve_decision_point_clinical_requests(
    obj: DecisionPoint = None, info: GraphQLResolveInfo = None, *_
):
    # TODO: added another dataloader to get by decision point ID
    # tieClinicalRequest=await TestResultByReferenceIdFromIELoader.load_from_id(
    # context=info.context, id=obj.id)
    # query.order_by(tieClinicalRequest.added_at)
    query = ClinicalRequest.query.where(ClinicalRequest.decision_point_id == obj.id)
    query.order_by(ClinicalRequest.added_at.desc())
    async with info.context['db'].acquire(reuse=False) as conn:
        clinical_requests: Union[List[ClinicalRequest], None] = await conn.all(query)
        for clinical_request in clinical_requests:
            ClinicalRequestByDecisionPointLoader.prime_with_context(
                info.context, clinical_request.id, clinical_request)
        return clinical_requests
