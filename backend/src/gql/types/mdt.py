from ariadne.objects import ObjectType
from dataloaders import (
    UserByIdLoader,
    PathwayByIdLoader
)
from graphql.type import GraphQLResolveInfo
from models import MDT

MDTObjectType = ObjectType("MDT")


@MDTObjectType.field("creator")
async def resolve_mdt_creator(
    obj: MDT = None,
    info: GraphQLResolveInfo = None,
):
    return await UserByIdLoader.load_from_id(
        context=info.context,
        id=obj.creator_user_id
    )


@MDTObjectType.field("pathway")
async def resolve_mdt_pathway(
    obj: MDT = None,
    info: GraphQLResolveInfo = None,
):
    return await PathwayByIdLoader.load_from_id(
        context=info.context,
        id=obj.pathway_id
    )
