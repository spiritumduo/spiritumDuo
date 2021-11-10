import graphene

class PathwayType(graphene.ObjectType):
    id=graphene.ID()
    name=graphene.String()

    interfaces=(graphene.relay.Node, )
    fields="__all__"

class _InputPathwayType(graphene.InputObjectType):
    name=graphene.String()


class PathwayTypeConnection(graphene.relay.Connection):
    class Meta:
        node=PathwayType