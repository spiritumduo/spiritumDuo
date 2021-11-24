from .mutation_type import mutation
from api.dataloaders import UserLoader
from django.contrib.auth.models import Group
from api.common import database_sync_to_async

@mutation.field("addUserToGroup")
async def resolve_add_user_to_group(_=None, info=None, input=None):
    user=await UserLoader.load_from_id(info.context, input["user"])
    group=await database_sync_to_async(Group.objects.get)(name=input["groupName"])
    if not user or not group:
        return None
    await database_sync_to_async(user.groups.add)(group)
    return user