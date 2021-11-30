from .mutation_type import mutation
from django.contrib.auth import authenticate
from api.dataloaders import UserLoader
from api.common import db_sync_to_async

@mutation.field("login")
async def resolve_login(_=None, info=None, username=None, password=None):
    user=await db_sync_to_async(authenticate)(username=username, password=password)
    if user is None:
        return None
    
    return user