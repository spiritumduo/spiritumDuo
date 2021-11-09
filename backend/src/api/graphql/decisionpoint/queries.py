import graphene

from api.dao.DecisionPointDAO import DecisionPointDAO

class _DecisionPointQueries(graphene.ObjectType):
    def _resolve_decisionpoints(root, info): # Gets all data 
        return DecisionPointDAO.read()