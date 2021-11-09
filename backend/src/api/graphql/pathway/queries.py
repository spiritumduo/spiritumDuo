import graphene

from api.dao.PathwayDAO import PathwayDAO

class _PathwayQueries(graphene.ObjectType):
    def _resolve_pathways(root, info): # Gets all data 
        return PathwayDAO.read()
    def _resolve_pathway_search(root, info, id, name): # Gets specified data only
        return PathwayDAO.read(id=id, name=name)