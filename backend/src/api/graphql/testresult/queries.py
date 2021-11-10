import graphene

from api.dao.TestResultDAO import TestResultDAO

class _TestResultQueries(graphene.ObjectType):
    def _resolve_get_test_results(root, info):
        return TestResultDAO.read()
    def _resolve_get_test_result_by_record_id(root, info, id):
        return TestResultDAO.read(id=id)
    def _resolve_get_test_result_by_patient_id(root, info, id):
        return TestResultDAO.read(patientId=id)