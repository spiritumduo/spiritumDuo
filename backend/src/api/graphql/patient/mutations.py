from django.db.models.lookups import GreaterThanOrEqual
import graphene
from api.dao.PatientDAO import PatientDAO
from .types import PatientType, _InputPatientType

class CreatePatient(graphene.Mutation): # Create class inheriting mutation class
    data=graphene.Field(PatientType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        input=graphene.Argument(_InputPatientType, required=True)
    def mutate(self, info, input): # function to handle mutation
        newPatient=PatientDAO(
            hospital_number=input.hospital_number, 
            national_number=input.national_number, 
            communication_method=input.communication_method, 
            first_name=input.first_name, 
            last_name=input.last_name, 
            date_of_birth=input.date_of_birth
        )
        newPatient.save()
        return CreatePatient(data=newPatient) # return data

class AssignPathwayToPatient(graphene.Mutation):
    success=graphene.Boolean()
    class Arguments:
        patientId=graphene.Int(required=True)
        pathwayId=graphene.Int(required=True)
    def mutate(self, info, patientId, pathwayId):
        patient=PatientDAO.read(id=patientId)
        patient._orm.pathways.add(pathwayId)
        patient.save()
        AssignPathwayToPatient(success=True)