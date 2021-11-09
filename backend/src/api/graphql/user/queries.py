import graphene
from api.dao import UserDAO

class _UserQueries(graphene.ObjectType):
    def _resolve_users(root, info): # Gets all data 
        return UserDAO.readAll()