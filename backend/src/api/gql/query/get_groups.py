from .query_type import query
from django.contrib.auth.models import Group
from api.common import db_sync_to_async

@query.field("getGroups")
async def resolve_get_groups(obj=None, info=None):
    return await db_sync_to_async(list)(Group.objects.all())