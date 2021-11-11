import graphene

class PathwayType(graphene.ObjectType):
    id=graphene.ID()
    name=graphene.String()
    type=graphene.String()
    is_discharged=graphene.Boolean()
    
    interfaces=(graphene.relay.Node, )
    fields="__all__"

class _InputPathwayType(graphene.InputObjectType):
    name=graphene.String(required=True)
    type=graphene.String(required=True)
    is_discharged=graphene.Boolean(required=True)


class PathwayTypeConnection(graphene.relay.Connection):
    class Meta:
        node=PathwayType