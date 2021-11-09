import graphene

from .mutations import LoginMutation

class LoginMutations(graphene.ObjectType):
    login=LoginMutation.Field()