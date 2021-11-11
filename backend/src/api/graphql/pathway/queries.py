import graphene

from api.dao.PathwayDAO import PathwayDAO

class _PathwayQueries(graphene.ObjectType):
    def _resolve_pathways(root, info):  # Gets all data
        return PathwayDAO.read()
    def _resolve_pathway_search(root, info, id=None, name=None): # Gets specified data only
        return PathwayDAO.read(id=id, name=name)
    def _resolve_pathways_for_patient(root, info, patientId=None):
        return PathwayDAO.readRelations(patientId=patientId)
    def _resolve_patients_for_pathway(root, info, pathwayId=None):
        return PathwayDAO.readRelations(pathwayId=pathwayId)