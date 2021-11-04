import graphene

from .mutations import LoginMutation
from .types import UserType

class LoginMutations(graphene.ObjectType):
    login=LoginMutation.Field()