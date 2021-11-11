import graphene

from api.dao.RoleDAO import RoleDAO

class _RoleQueries(graphene.ObjectType):
    def _resolve_get_roles(root, info): # Gets all data 
        return RoleDAO.read()
    def _resolve_get_role_by_search(root, info, id=None, name=None): # Gets specified data only
        return RoleDAO.read(id=id, name=name)