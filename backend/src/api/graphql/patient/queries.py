import graphene

from api.dao.PatientDAO import PatientDAO

class _PatientQueries(graphene.ObjectType):
    def _resolve_patients(root, info): # Gets all data 
        return PatientDAO.read()
    def _resolve_patient_search(root, info, searchParam=None, searchParamExtension=None): # Gets specified data only
        return PatientDAO.read(searchParam, searchParamExtension)