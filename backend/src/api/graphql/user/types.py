from django.db.models.lookups import GreaterThanOrEqual
import graphene

class UserType(graphene.ObjectType):
    id=graphene.ID()
    first_name=graphene.String()
    last_name=graphene.String()
    username=graphene.String()
    password=graphene.String()
    department=graphene.String()
    is_staff=graphene.Boolean()
    is_super_user=graphene.Boolean()
    last_login=graphene.DateTime()

class _InputUserType(graphene.InputObjectType):
    first_name=graphene.String()
    last_name=graphene.String()
    username=graphene.String()
    password=graphene.String()
    department=graphene.String()
    is_staff=graphene.Boolean()
    is_superuser=graphene.Boolean()
    last_login=graphene.DateTime()