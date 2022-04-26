from typing import List
from .query_type import query
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import Role
from models.db import db


@query.field("getRoles")
@needsAuthorization([Permissions.ROLE_READ])
async def resolve_get_role(
    obj=None,
    info: GraphQLResolveInfo = None
):
    async with db.acquire(reuse=False) as conn:
        roles_query = db.select([Role])
        roles = await conn.all(roles_query)
    return roles
