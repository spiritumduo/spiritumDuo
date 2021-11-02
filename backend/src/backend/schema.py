import graphene
from backend.api.submodels.patient import PatientModel
class PatientType(graphene.ObjectType):
    id=graphene.ID()
<<<<<<< Updated upstream
    hospital_number=graphene.String()
    national_number=graphene.Int()
    communication_method=graphene.String()
    first_name=graphene.String()
    last_name=graphene.String()
    date_of_birth=graphene.Date()
class _InputPatientType(graphene.InputObjectType):
    id=graphene.ID()
=======
    hospitalNumber=graphene.String()
    nationalNumber=graphene.Int()
    communicationMethod=graphene.String()
    firstName=graphene.String()
    lastName=graphene.String()
    dateOfBirth=graphene.Date()
class _InputPatientType(graphene.InputObjectType):
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            id=patientInput.id, 
=======
>>>>>>> Stashed changes
            hospitalNumber=patientInput.hospitalNumber, 
            nationalNumber=patientInput.nationalNumber, 
            communicationMethod=patientInput.communicationMethod, 
            firstName=patientInput.firstName, 
            lastName=patientInput.lastName, 
            dateOfBirth=patientInput.dateOfBirth
<<<<<<< Updated upstream
        ) # create patient object based off data provided
        newPatient.save() # save patient record to database
        return CreatePatient(patient=newPatient) # return data
=======
        )
        return CreatePatient(patient=newPatient.save()) # return data
>>>>>>> Stashed changes

class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()

class Query(graphene.ObjectType):
    patient = graphene.List(PatientType)
<<<<<<< Updated upstream
    patient_by_identifier = graphene.Field(PatientType, searchParam=graphene.String())
    
    def resolve_patient(root, info): # Gets all data 
        return PatientModel.read()
    def resolve_patient_by_identifier(root, info, searchParam): # Gets specified data only
        return PatientModel.read(searchParam) or None
=======
    # patient_by_identifier = graphene.Field(PatientType, searchParam=graphene.String())
    
    def resolve_patient(root, info): # Gets all data 
        return PatientModel.read()
    # def resolve_patient_by_identifier(root, info, searchParam): # Gets specified data only
    #     return PatientModel.read(searchParam) or None
>>>>>>> Stashed changes

schema = graphene.Schema(query=Query, mutation=Mutation)