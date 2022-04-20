from .query_type import query
from dataloaders import PathwayByIdLoader
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions


@query.field("getPathways")
@needsAuthorization([Permissions.PATHWAY_READ])
async def resolve_get_pathway(
    obj=None,
    info: GraphQLResolveInfo = None
):
    return await PathwayByIdLoader.load_all()
