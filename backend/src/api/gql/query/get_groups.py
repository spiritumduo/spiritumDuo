from .query_type import query
from django.contrib.auth.models import Group
from channels.db import database_sync_to_async

@query.field("getGroups")
async def resolve_get_groups(obj=None, info=None):
    return await database_sync_to_async(list)(Group.objects.all())