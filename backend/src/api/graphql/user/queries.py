import graphene
from api.dao import UserDAO

class _UserQueries(graphene.ObjectType):
    def _resolve_users(root, info): # Gets all data 
        return UserDAO.readAll()
    def _resolve_user_search(root, info, userID):
        return UserDAO.read(userId=userID)