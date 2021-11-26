from ariadne.objects import ObjectType
from api.common import db_sync_to_async

GroupObjectType=ObjectType("Group")

@GroupObjectType.field("permissions")
async def resolve_group_permissions(obj=None, *_):
    return await db_sync_to_async(list)(obj.permissions.all()) 