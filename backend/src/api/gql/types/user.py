from ariadne.objects import ObjectType
from api.common import database_sync_to_async
from api.models import UserProfile
from django.contrib.auth.models import Group

UserObjectType=ObjectType("User")

@UserObjectType.field("department")
async def resolve_user_department(obj=None, *_):
    if not obj:
        return None
    profiles=await database_sync_to_async(UserProfile.objects.select_related)("user")
    userProfile=await database_sync_to_async(profiles.get)(user=obj.id)
    department=userProfile.department
    return department

@UserObjectType.field("groups")
async def resolve_user_groups(obj=None, *_):
    userGroup=await database_sync_to_async(list)(Group.objects.filter(user=obj.id))
    return userGroup