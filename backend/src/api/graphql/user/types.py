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
    first_name=graphene.String(required=True)
    last_name=graphene.String(required=True)
    username=graphene.String(required=True)
    password=graphene.String(required=True)
    department=graphene.String(required=True)
    is_staff=graphene.Boolean(required=True)
    is_superuser=graphene.Boolean(required=True)
    last_login=graphene.DateTime()