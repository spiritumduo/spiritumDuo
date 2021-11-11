import graphene

class RoleType(graphene.ObjectType):
    id=graphene.ID()
    name=graphene.String()
class _InputRoleType(graphene.InputObjectType):
    name=graphene.String(required=True)