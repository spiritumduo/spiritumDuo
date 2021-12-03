from .query_type import query
from dataloaders import PathwayByIdLoader

@query.field("getPathway")
async def resolve_get_pathway(obj=None, info=None, id=None):
    if id:
        return await PathwayByIdLoader.load_from_id(info.context, id)
    else:
        return None