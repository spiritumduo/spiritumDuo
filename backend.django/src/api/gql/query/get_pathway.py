from .query_type import query
from api.dataloaders import PathwayLoader

@query.field("getPathways")
async def resolve_get_pathways(obj=None, info=None):
    return await PathwayLoader.load_all()