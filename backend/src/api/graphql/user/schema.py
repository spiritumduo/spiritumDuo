import graphene

from .mutations import CreateUser
from .queries import _UserQueries
from .types import UserType

class UserQueries(_UserQueries, graphene.ObjectType):
    users=graphene.List(UserType)
    patient_search = graphene.Field(UserType)
    # this way we can keep it modular for permission decorators
    def resolve_users(root, info):
        return _UserQueries._resolve_users(root, info)

class UserMutations(graphene.ObjectType):
    create_user=CreateUser.Field()