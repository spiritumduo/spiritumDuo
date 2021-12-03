from .query_type import query
from api.dataloaders import PathwayByIdLoader

@query.field("getPathways")
async def resolve_get_pathways(obj=None, info=None):
    return await PathwayByIdLoader.load_all()