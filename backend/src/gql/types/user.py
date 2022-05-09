from ariadne.objects import ObjectType
from dataloaders import PathwayByIdLoader
from models import User, Role, UserRole, Pathway, UserPathways
from graphql.type import GraphQLResolveInfo
from models.db import db

UserObjectType = ObjectType("User")


@UserObjectType.field("defaultPathway")
async def resolver(obj: User = None, info: GraphQLResolveInfo = None, *_):
    return await PathwayByIdLoader.load_from_id(
        context=info.context, id=obj.default_pathway_id)


@UserObjectType.field("roles")
async def resolve_roles(
    obj: User = None, info: GraphQLResolveInfo = None, *_
):
    async with db.acquire(reuse=False) as conn:
        query = Role.join(UserRole).select()\
            .where(UserRole.user_id == obj.id)
        roles = await conn.all(query)
    return roles


@UserObjectType.field("pathways")
async def resolve_pathways(
    obj: User = None, info: GraphQLResolveInfo = None, *_
):
    async with db.acquire(reuse=False) as conn:
        query = Pathway.join(UserPathways).select()\
            .where(UserPathways.user_id == obj.id)
        pathways = await conn.all(query)
    return pathways
