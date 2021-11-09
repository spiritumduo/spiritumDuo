import graphene

from .mutations import CreateUser
from .queries import _UserQueries
from .types import UserType

class UserQueries(_UserQueries, graphene.ObjectType):
    users=graphene.List(UserType)
    user_search = graphene.Field(UserType, userID=graphene.Int())
    # this way we can keep it modular for permission decorators
    def resolve_users(root, info):
        return _UserQueries._resolve_users(root, info)
    def resolve_user_search(root, info, userID):
        return _UserQueries._resolve_user_search(root, info, userID)

class UserMutations(graphene.ObjectType):
    create_user=CreateUser.Field()