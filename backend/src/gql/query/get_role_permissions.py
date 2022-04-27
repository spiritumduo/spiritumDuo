from .query_type import query
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions


@query.field("getRolePermissions")
@needsAuthorization([Permissions.ROLE_PERMISSIONS_READ])
async def resolve_get_role_permissions(
    obj=None,
    info: GraphQLResolveInfo = None
):
    return [e for e in Permissions]
