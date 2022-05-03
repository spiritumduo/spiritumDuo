from ariadne.objects import ObjectType
from dataloaders import (
    PathwayLoaderByMilestoneType,
)
from models import MilestoneType
from graphql.type import GraphQLResolveInfo

MilestoneTypeType = ObjectType("MilestoneType")


@MilestoneTypeType.field("pathways")
async def resolve_pathways(
    obj: MilestoneType = None, info: GraphQLResolveInfo = None, *_
):
    return await PathwayLoaderByMilestoneType.load_from_id(
        context=info.context, id=obj.id)
