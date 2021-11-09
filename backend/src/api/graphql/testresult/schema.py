import graphene

from .mutations import CreateTestResult
from .queries import _TestResultQueries

from .types import TestResultType

class TestResultQueries(_TestResultQueries, graphene.ObjectType):
    test_results=graphene.List(TestResultType)
    test_result_search=graphene.Field(TestResultType, id=graphene.Int())
    test_result_search_by_patient=graphene.List(TestResultType, id=graphene.Int())
    # this way we can keep it modular for permission decorators
    def resolve_test_results(root, info):
        return _TestResultQueries._resolve_test_results(root, info)
    def resolve_test_result_search(root, info, id):
        return _TestResultQueries._resolve_test_result_search(root, info, id)
    def resolve_test_result_search_by_patient(root, info, id):
        return _TestResultQueries._resolve_test_result_search_by_patient(root, info, id)

class TestResultMutations(graphene.ObjectType):
    create_test_result=CreateTestResult.Field()