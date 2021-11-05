import graphene

from .mutations import CreateDecisionPoint
from .queries import _DecisionPointQueries

from .types import DecisionPointType

class DecisionPointQueries(_DecisionPointQueries, graphene.ObjectType):
    decisionpoints=graphene.List(DecisionPointType)
    # this way we can keep it modular for permission decorators
    def resolve_decisionpoints(root, info):
        return _DecisionPointQueries._resolve_decisionpoints(root, info)

class DecisionPointMutations(graphene.ObjectType):
    create_decisionpoint=CreateDecisionPoint.Field()