from .query_type import query
from dataloaders import UserByIdLoader

@query.field("getUser")
async def resolve_get_user(obj=None, info=None, id=None):
    if id:
        return await UserByIdLoader.load_from_id(info.context, id)
    else:
        return None