import graphene

class UserType(graphene.ObjectType):
    id=graphene.ID()
    firstName=graphene.String()
    lastName=graphene.String()
    username=graphene.String()
    department=graphene.String()
    lastAccess=graphene.Date()
    roles=graphene.List(graphene.String)