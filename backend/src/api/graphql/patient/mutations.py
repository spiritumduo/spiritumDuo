import graphene
from api.dao.PatientDAO import PatientDAO
from .types import PatientType, _InputPatientType

class CreatePatient(graphene.Mutation): # Create class inheriting mutation class
    patient=graphene.Field(PatientType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        patientInput=graphene.Argument(_InputPatientType)
    def mutate(self, info, patientInput): # function to handle mutation
        newPatient=PatientDAO(
            hospitalNumber=patientInput.hospitalNumber, 
            nationalNumber=patientInput.nationalNumber, 
            communicationMethod=patientInput.communicationMethod, 
            firstName=patientInput.firstName, 
            lastName=patientInput.lastName, 
            dateOfBirth=patientInput.dateOfBirth
        )
        return CreatePatient(patient=newPatient.save()) # return data