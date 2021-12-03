from .query_type import query
from dataloaders import PathwayByIdLoader

@query.field("getPathways")
async def resolve_get_pathway(obj=None, info=None):
    return await PathwayByIdLoader.load_all()