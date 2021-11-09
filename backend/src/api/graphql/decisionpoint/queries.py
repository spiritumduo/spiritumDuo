import graphene

from api.dao.DecisionPointDAO import DecisionPointDAO

class _DecisionPointQueries(graphene.ObjectType):
    def _resolve_decision_points(root, info): # Gets all data 
        return DecisionPointDAO.read()
    def _resolve_decision_point_search(root, info, id):
        return DecisionPointDAO.read(id=id)
    def _resolve_decision_point_search_by_patient(root, info, id):
        return DecisionPointDAO.read(patientId=id)