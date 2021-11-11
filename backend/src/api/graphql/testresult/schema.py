import graphene

from .mutations import CreateTestResult
from .queries import _TestResultQueries

from .types import TestResultType

class TestResultQueries(_TestResultQueries, graphene.ObjectType):
    get_test_results=graphene.List(TestResultType)
    get_test_result_by_record_id=graphene.Field(TestResultType, id=graphene.Int())
    get_test_result_by_patient_id=graphene.List(TestResultType, id=graphene.Int())
    # this way we can keep it modular for permission decorators
    def resolve_get_test_results(root, info):
        return _TestResultQueries._resolve_get_test_results(root, info)
    def resolve_get_test_result_by_record_id(root, info, id=None):
        return _TestResultQueries._resolve_get_test_result_by_record_id(root, info, id)
    def resolve_get_test_result_by_patient_id(root, info, id=None):
        return _TestResultQueries._resolve_get_test_result_by_patient_id(root, info, id)

class TestResultMutations(graphene.ObjectType):
    create_test_result=CreateTestResult.Field()