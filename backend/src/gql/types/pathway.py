from ariadne.objects import ObjectType
from dataloaders import (
    ClinicalRequestTypeLoaderByPathwayId,
)
from models import ClinicalRequestType
from graphql.type import GraphQLResolveInfo

PathwayObjectType = ObjectType("Pathway")


@PathwayObjectType.field("clinicalRequestTypes")
async def resolve_pathways(
    obj: ClinicalRequestType = None, info: GraphQLResolveInfo = None, *_
):
    return await ClinicalRequestTypeLoaderByPathwayId.load_from_id(
        context=info.context, id=obj.id)
