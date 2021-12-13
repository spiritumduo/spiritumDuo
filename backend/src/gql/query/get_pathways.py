from .query_type import query
from dataloaders import PathwayByIdLoader
from authentication.authentication import needsAuthorization

@query.field("getPathways")
@needsAuthorization(["authenticated"])
async def resolve_get_pathway(obj=None, info=None):
    return await PathwayByIdLoader.load_all()