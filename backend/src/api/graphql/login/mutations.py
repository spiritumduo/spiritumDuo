import graphene
from api.dao import UserDAO
from .types import UserType
from django.contrib.auth import authenticate

class LoginMutation(graphene.Mutation):
    """This handles our Login. It uses the Django authentication system"""
    class Arguments:
        username = graphene.String()
        password = graphene.String()
    user = graphene.Field(UserType)

    # The docs say use a classmethod, but the examples are clearly
    # static.
    # https://docs.graphene-python.org/projects/django/en/latest/mutations/
    @staticmethod
    def mutate(root, info, username, password):
        user = authenticate(username=username, password=password)
        if user is not None:
            return LoginMutation(user=user)
        else:
            return None