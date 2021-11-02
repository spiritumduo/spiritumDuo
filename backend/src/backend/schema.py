import graphene

'''
    PATIENT DATA MODELLING
'''
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




'''
    CONFIGURATION DATA MODELLING
'''
from backend.api.submodels.configuration import ConfigurationModel

class ConfigurationType(graphene.ObjectType):
    hospitalNumberName=graphene.String()
    hospitalNumberRegex=graphene.String()
    nationalPatientNumberName=graphene.String()
    nationalPatientNumberRegex=graphene.String()

class _InputConfigurationType(graphene.InputObjectType):
    hospitalNumberName=graphene.String()
    hospitalNumberRegex=graphene.String()
    nationalPatientNumberName=graphene.String()
    nationalPatientNumberRegex=graphene.String()

class CreateConfiguration(graphene.Mutation):
    configuration=graphene.Field(ConfigurationType)
    class Arguments:
        configurationInput=graphene.Argument(_InputConfigurationType)
    def mutate(self, info, configurationInput):
        newConfiguration=ConfigurationModel(
            hospitalNumberName=configurationInput.hospitalNumberName,
            hospitalNumberRegex=configurationInput.hospitalNumberRegex,
            nationalPatientNumberName=configurationInput.nationalPatientNumberName,
            nationalPatientNumberRegex=configurationInput.nationalPatientNumberRegex,
        )
        return CreateConfiguration(configuration=newConfiguration.save())






class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()
    create_configuration = CreateConfiguration.Field()
class Query(graphene.ObjectType):
    patient = graphene.List(PatientType)
    patient_by_identifier = graphene.Field(PatientType, searchParam=graphene.String())
    
    def resolve_patient(root, info): # Gets all data 
        return PatientModel.read()
    def resolve_patient_by_identifier(root, info, searchParam): # Gets specified data only
        return PatientModel.read(searchParam)

    configuration=graphene.List(ConfigurationType)

    def resolve_configuration(root, info):
        return ConfigurationModel.read()

schema = graphene.Schema(query=Query, mutation=Mutation)