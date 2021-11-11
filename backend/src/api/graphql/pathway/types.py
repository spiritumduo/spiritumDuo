import graphene

class PathwayType(graphene.ObjectType):
    id=graphene.ID()
    name=graphene.String()

    interfaces=(graphene.relay.Node, )
    fields="__all__"

class _InputPathwayType(graphene.InputObjectType):
    name=graphene.String(required=True)


class PathwayTypeConnection(graphene.relay.Connection):
    class Meta:
        node=PathwayType