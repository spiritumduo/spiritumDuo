import graphene

from api.dao.PatientDAO import PatientDAO
class _PatientQueries(graphene.ObjectType):
    def _resolve_get_patients(root, info): # Gets all data 
        return PatientDAO.read()
    def _resolve_get_patient_by_search(root, info, id=None, hospital_number=None, national_number=None, first_name=None, last_name=None, date_of_birth=None): # Gets specified data only
        return PatientDAO.read(id=id, hospital_number=hospital_number, national_number=national_number, first_name=first_name, last_name=last_name, date_of_birth=date_of_birth)