from ariadne.objects import ObjectType
from dataloaders import (
    PathwayLoaderByClinicalRequestType,
)
from models import ClinicalRequestType
from graphql.type import GraphQLResolveInfo

ClinicalRequestTypeType = ObjectType("ClinicalRequestType")


@ClinicalRequestTypeType.field("pathways")
async def resolve_pathways(
    obj: ClinicalRequestType = None, info: GraphQLResolveInfo = None, *_
):
    return await PathwayLoaderByClinicalRequestType.load_from_id(
        context=info.context, id=obj.id)
