import graphene

from api.dao.TestResultDAO import TestResultDAO

class _TestResultQueries(graphene.ObjectType):
    def _resolve_test_results(root, info):
        return TestResultDAO.read()
    def _resolve_test_result_search(root, info, id):
        return TestResultDAO.read(id=id)
    def _resolve_test_result_search_by_patient(root, info, id):
        return TestResultDAO.read(patientId=id)