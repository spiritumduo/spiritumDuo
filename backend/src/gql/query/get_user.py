from .query_type import query
from dataloaders import UserByIdLoader, UserByUsernameLoader

@query.field("getUser")
async def resolve_get_user(obj=None, info=None, id=None, username=None):
    if id:
        return await UserByIdLoader.load_from_id(info.context, id)
    elif username:
        return await UserByUsernameLoader.load_from_id(info.context, username)
    else:
        return None