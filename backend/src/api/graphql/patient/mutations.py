import graphene
from api.dao.PatientDAO import PatientDAO
from .types import PatientType, _InputPatientType

class CreatePatient(graphene.Mutation): # Create class inheriting mutation class
    patient=graphene.Field(PatientType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        input=graphene.Argument(_InputPatientType)
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
        return CreatePatient(patient=newPatient) # return data