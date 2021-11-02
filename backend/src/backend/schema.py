import graphene
from backend.api.submodels.patient import PatientModel
class PatientType(graphene.ObjectType):
    id=graphene.ID()

    hospitalNumber=graphene.String()
    nationalNumber=graphene.Int()
    communicationMethod=graphene.String()
    firstName=graphene.String()
    lastName=graphene.String()
    dateOfBirth=graphene.Date()
class _InputPatientType(graphene.InputObjectType):
    hospitalNumber=graphene.String()
    nationalNumber=graphene.Int()
    communicationMethod=graphene.String()
    firstName=graphene.String()
    lastName=graphene.String()
    dateOfBirth=graphene.Date()

# CREATING NEW RECORDS
class CreatePatient(graphene.Mutation): # Create class inheriting mutation class
    patient=graphene.Field(PatientType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        patientInput=graphene.Argument(_InputPatientType)
    def mutate(self, info, patientInput): # function to handle mutation
        newPatient=PatientModel(
            hospitalNumber=patientInput.hospitalNumber, 
            nationalNumber=patientInput.nationalNumber, 
            communicationMethod=patientInput.communicationMethod, 
            firstName=patientInput.firstName, 
            lastName=patientInput.lastName, 
            dateOfBirth=patientInput.dateOfBirth
        )
        return CreatePatient(patient=newPatient.save()) # return data

class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()

class Query(graphene.ObjectType):
    patient = graphene.List(PatientType)
    # patient_by_identifier = graphene.Field(PatientType, searchParam=graphene.String())
    
    def resolve_patient(root, info): # Gets all data 
        return PatientModel.read()
    # def resolve_patient_by_identifier(root, info, searchParam): # Gets specified data only
    #     return PatientModel.read(searchParam) or None

schema = graphene.Schema(query=Query, mutation=Mutation)