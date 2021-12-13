from .query_type import query
from dataloaders import PathwayByIdLoader
from authentication.authentication import needsAuthorization

@query.field("getPathway")
@needsAuthorization(["authenticated"])
async def resolve_get_pathway(obj=None, info=None, id=None):
    if id:
        return await PathwayByIdLoader.load_from_id(info.context, id)
    else:
        return None