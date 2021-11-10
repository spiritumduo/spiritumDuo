import graphene

from .mutations import CreateUser
from .queries import _UserQueries
from .types import UserType

class UserQueries(_UserQueries, graphene.ObjectType):
    get_users=graphene.List(UserType)
    get_user_by_id = graphene.Field(UserType, userID=graphene.Int())
    # this way we can keep it modular for permission decorators
    def resolve_get_users(root, info):
        return _UserQueries._resolve_get_users(root, info)
    def resolve_get_user_by_id(root, info, userID):
        return _UserQueries._resolve_get_user_by_id(root, info, userID)

class UserMutations(graphene.ObjectType):
    create_user=CreateUser.Field()