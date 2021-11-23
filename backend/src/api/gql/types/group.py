from ariadne.objects import ObjectType
from channels.db import database_sync_to_async

GroupObjectType=ObjectType("Group")

@GroupObjectType.field("permissions")
async def resolve_group_permissions(obj=None, *_):
    return await database_sync_to_async(list)(obj.permissions.all()) 