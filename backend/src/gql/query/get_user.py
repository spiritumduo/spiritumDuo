from .query_type import query
from dataloaders import UserByIdLoader, UserByUsernameLoader
from authentication.authentication import needsAuthorization
from SdTypes import Permissions


@query.field("getUser")
@needsAuthorization([Permissions.USER_READ])
async def resolve_get_user(
    obj=None,
    info=None,
    id: int = None,
    username: str = None
):
    if id:
        return await UserByIdLoader.load_from_id(info.context, id)
    elif username:
        return await UserByUsernameLoader.load_from_id(info.context, username)
    else:
        return None
