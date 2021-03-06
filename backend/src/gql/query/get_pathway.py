from .query_type import query
from dataloaders import PathwayByIdLoader
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions


@query.field("getPathway")
@needsAuthorization([Permissions.PATHWAY_READ])
async def resolve_get_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    id: int = None
):
    if id:
        return await PathwayByIdLoader.load_from_id(info.context, id)
    else:
        return None
