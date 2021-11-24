from .mutation_type import mutation
from django.contrib.auth import authenticate
from api.dataloaders import UserLoader
from api.common import database_sync_to_async

@mutation.field("login")
async def resolve_login(_=None, info=None, username=None, password=None):
    user=await database_sync_to_async(authenticate)(username=username, password=password)
    if user is None:
        return None
    
    return await UserLoader.load_from_id(info.context, user.id)