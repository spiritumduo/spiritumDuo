import graphene

from .mutations import CreateDecisionPoint
from .queries import _DecisionPointQueries

from .types import DecisionPointType

class DecisionPointQueries(_DecisionPointQueries, graphene.ObjectType):
    get_decision_points=graphene.List(DecisionPointType)
    get_decision_point_by_record_id=graphene.Field(DecisionPointType, id=graphene.Int(required=True))
    get_decision_point_by_patient_id=graphene.List(DecisionPointType, id=graphene.Int(required=True))
    # this way we can keep it modular for permission decorators
    def resolve_get_decision_points(root, info):
        return _DecisionPointQueries._resolve_get_decision_points(root, info)
    def resolve_get_decision_point_by_record_id(root, info, id=None):
        return _DecisionPointQueries._resolve_get_decision_point_by_record_id(root, info, id)
    def resolve_get_decision_point_by_patient_id(root, info, id=None):
        return _DecisionPointQueries._resolve_get_decision_point_by_patient_id(root, info, id)

class DecisionPointMutations(graphene.ObjectType):
    create_decision_point=CreateDecisionPoint.Field()