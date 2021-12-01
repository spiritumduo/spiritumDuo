from .query_type import query
from dataloaders import PathwayLoader

@query.field("getPathways")
async def resolve_get_pathway(obj=None, info=None):
    return await PathwayLoader.load_all()