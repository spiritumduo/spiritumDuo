from .query_type import query
from api.dataloaders import UserLoader

@query.field("getUser")
async def resolve_get_user(obj=None, info=None, id=None):
    patient=await UserLoader.load_from_id(info.context, id)
    return patient or None