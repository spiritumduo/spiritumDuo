import graphene

from api.dao.DecisionPointDAO import DecisionPointDAO

class _DecisionPointQueries(graphene.ObjectType):
    def _resolve_get_decision_points(root, info): # Gets all data 
        return DecisionPointDAO.read()
    def _resolve_get_decision_point_by_record_id(root, info, id=None):
        return DecisionPointDAO.read(id=id)
    def _resolve_get_decision_point_by_patient_id(root, info, id=None):
        return DecisionPointDAO.read(patientId=id)