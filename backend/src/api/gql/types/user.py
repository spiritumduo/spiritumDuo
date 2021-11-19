from ariadne import gql
from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from api.models import UserProfile
type_defs=gql("""
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        userName: String!
        password: String
        lastAccess: Date!
        
        # from other data sources (related objects)
        department: String!
        roles: [Role!]
    }
""")

UserObjectType=ObjectType("User")

@UserObjectType.field("department")
async def resolve_user_department(obj=None, *_):
    if not obj:
        return None
    profiles=await database_sync_to_async(UserProfile.objects.select_related)("user")
    userProfile=await database_sync_to_async(profiles.get)(user=obj.id)
    department=userProfile.department
    return department