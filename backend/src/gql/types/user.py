from typing import List
from ariadne.objects import ObjectType
from dataloaders import PathwayByIdLoader
from models import User, Role, UserRole
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
        roles_query = db.select([Role]).where(
            User.id == UserRole.user_id
        ).where(
            Role.id == UserRole.role_id
        ).where(
            obj.id == UserRole.user_id
        )
        roles = await conn.all(roles_query)
    return roles
