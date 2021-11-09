import graphene

class PathwayType(graphene.ObjectType):
    id=graphene.ID()
    name=graphene.String()
class _InputPathwayType(graphene.InputObjectType):
    name=graphene.String()