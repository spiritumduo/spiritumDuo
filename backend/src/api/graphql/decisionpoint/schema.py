import graphene

from .mutations import CreateDecisionPoint
from .queries import _DecisionPointQueries

from .types import DecisionPointType

class DecisionPointQueries(_DecisionPointQueries, graphene.ObjectType):
    decision_points=graphene.List(DecisionPointType)
    decision_point_search=graphene.Field(DecisionPointType, id=graphene.Int())
    decision_point_search_by_patient=graphene.List(DecisionPointType, id=graphene.Int())
    # this way we can keep it modular for permission decorators
    def resolve_decision_points(root, info):
        return _DecisionPointQueries._resolve_decision_points(root, info)
    def resolve_decision_point_search(root, info, id):
        return _DecisionPointQueries._resolve_decision_point_search(root, info, id)
    def resolve_decision_point_search_by_patient(root, info, id):
        return _DecisionPointQueries._resolve_decision_point_search_by_patient(root, info, id)

class DecisionPointMutations(graphene.ObjectType):
    create_decision_point=CreateDecisionPoint.Field()