from ariadne.objects import ObjectType
from models import OnPathway
from dataloaders import (
    PatientByIdLoader,
    PathwayByIdLoader,
    DecisionPointsByOnPathway,
    UserByIdLoader,
    ClinicalRequestByOnPathwayIdLoader
)
from graphql.type import GraphQLResolveInfo

OnPathwayObjectType = ObjectType("OnPathway")


@OnPathwayObjectType.field("pathway")
async def resolve_on_pathway_pathway(
    obj: OnPathway = None, info: GraphQLResolveInfo = None, *_
):
    return await PathwayByIdLoader.load_from_id(
        context=info.context, id=obj.pathway_id)


@OnPathwayObjectType.field("patient")
async def resolve_on_pathway_patient(
    obj: OnPathway = None, info: GraphQLResolveInfo = None, *_
):
    return await PatientByIdLoader.load_from_id(
        context=info.context, id=obj.patient_id)


@OnPathwayObjectType.field("decisionPoints")
async def resolve_decision_points(
    obj: OnPathway = None, info: GraphQLResolveInfo = None, *_
):
    return await DecisionPointsByOnPathway.load_many_from_id(
        context=info.context, id=obj.id)


@OnPathwayObjectType.field("underCareOf")
async def resolve_under_care_of(
    obj: OnPathway = None, info: GraphQLResolveInfo = None, *_
):
    return await UserByIdLoader.load_from_id(
        context=info.context, id=obj.under_care_of_id)


@OnPathwayObjectType.field("clinicalRequests")
async def resolver(
    obj: OnPathway = None,
    info: GraphQLResolveInfo = None,
    outstanding: bool = False,
    limit: int = 0, *_
):
    result = await ClinicalRequestByOnPathwayIdLoader.load_from_id(
        context=info.context, id=obj.id, outstanding=outstanding, limit=limit
    )
    return result


@OnPathwayObjectType.field("lockUser")
async def resolve_lock_user(
    obj: OnPathway = None,
    info: GraphQLResolveInfo = None, *_
):
    return await UserByIdLoader.load_from_id(
        context=info.context,
        id=obj.lock_user_id
    )
