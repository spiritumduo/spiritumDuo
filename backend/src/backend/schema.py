import graphene
from graphene import InputObjectType
from graphene_django.types import DjangoObjectType
import json
from backend.api.models import Patient, User, Configuration, DecisionPoint, TestResult, DecisionPointTypes, Role

class RoleInput(InputObjectType):
    id=graphene.ID(required=True)
    roleName=graphene.String(required=True) 
class PatientInput(InputObjectType):
    id=graphene.ID(required=True)
    hospitalNumber=graphene.String(required=True)
    nationalNumber=graphene.String(required=True)
    communicationMethod=graphene.String(required=True)
    firstName=graphene.String(required=True)
    lastName=graphene.String(required=True)
    dateOfBirth=graphene.Date(required=True)
class UserInput(InputObjectType):
    id=graphene.ID(required=True)
    firstName=graphene.String(required=True)
    lastName=graphene.String(required=True)
    userName=graphene.String(required=True)
    passwordHash=graphene.String(required=True)
    department=graphene.String(required=True)
    lastAccess=graphene.DateTime(required=True)
    roles=graphene.List(RoleInput)

class ConfigurationInput(InputObjectType):
    hospitalNumberName=graphene.String(required=True)
    hospitalNumberRegex=graphene.String(required=True)
    nationalPatientNumberName=graphene.String(required=True)
    nationalPatientNumberRegex=graphene.String(required=True)

class DecisionPointInput(InputObjectType):
    id=graphene.ID(required=True)
    patient=graphene.Field(PatientInput)
    addedAt=graphene.DateTime(required=True)
    updatedAt=graphene.DateTime(required=True)
    clinician=graphene.Field(UserInput)
    DecisionPointType=graphene.String(required=True)
    clinicHistory=graphene.String(required=True)
    comorbidities=graphene.String(required=True)

class RoleType(DjangoObjectType):
    class Meta:
        model = Role
class PatientType(DjangoObjectType):
    class Meta:
        model = Patient
class UserType(DjangoObjectType):
    class Meta:
        model = User
class ConfigurationType(DjangoObjectType):
    class Meta:
        model=Configuration
class DecisionPointType(DjangoObjectType):
    class Meta:
        model=DecisionPoint



# CREATING NEW RECORDS
class CreatePatient(graphene.Mutation): # Create class inheriting mutation class
    patient=graphene.Field(PatientType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        patientInput=graphene.Argument(PatientInput)
    def mutate(self, info, patientInput): # function to handle mutation
        newPatient=Patient(id=patientInput.id, hospitalNumber=patientInput.hospitalNumber, nationalNumber=patientInput.nationalNumber, communicationMethod=patientInput.communicationMethod, firstName=patientInput.firstName, lastName=patientInput.lastName, dateOfBirth=patientInput.dateOfBirth) # create patient object based off data provided
        newPatient.save() # save patient record to database
        return CreatePatient(patient=newPatient) # return data

class CreateUser(graphene.Mutation):
    user=graphene.Field(UserType)
    class Arguments:
        userInput=graphene.Argument(UserInput)
    def mutate(self, info, userInput):
        newUser=User(id=userInput.id, firstName=userInput.firstName, lastName=userInput.lastName, userName=userInput.userName, passwordHash=userInput.passwordHash, department=userInput.department, lastAccess=userInput.lastAccess) # create patient object based off data provided
        newUser.save()
        for role in userInput.roles:
            newUser.roles.create(id=role.id, roleName=role.roleName)
        return CreateUser(user=newUser)

class CreateConfiguration(graphene.Mutation):
    config=graphene.Field(ConfigurationType)
    class Arguments:
        configInput=graphene.Argument(ConfigurationInput)
    def mutate(self, info, configInput):
        newConfig=Configuration(hospitalNumberName=configInput.hospitalNumberName, hospitalNumberRegex=configInput.hospitalNumberRegex, nationalPatientNumberName=configInput.nationalPatientNumberName, nationalPatientNumberRegex=configInput.nationalPatientNumberRegex)
        newConfig.save()
        return CreateConfiguration(config=newConfig)

class CreateDecisionPoint(graphene.Mutation):
    DP=graphene.Field(DecisionPointType)
    class Arguments:
        dpInput=graphene.Argument(DecisionPointInput)
    def mutate(self, info, dpInput):
        newDP=DecisionPoint(id=dpInput.id, patient=dpInput.patient, addedAt=dpInput.addedAt, updatedAt=dpInput.updatedAt, clinician=dpInput.clinician, DecisionPointType=dpInput.DecisionPointType, clinicHistory=dpInput.clinicHistory, comorbidities=dpInput.comorbidities)
        newDP.save()
        return CreateDecisionPoint(DP=newDP)

class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()
    create_user = CreateUser.Field()
    create_configuration=CreateConfiguration.Field()
    create_decisionpoint=CreateDecisionPoint.Field()

class Query(graphene.ObjectType):
    patients = graphene.List(PatientType)
    users = graphene.List(UserType)
    configuration=graphene.List(ConfigurationType)
    decisionpoint=graphene.List(DecisionPointType)

    patient_by_mrn = graphene.Field(PatientType, hospitalNumber=graphene.String())
    user_by_id=graphene.Field(UserType, id=graphene.Int())

    # Gets all data 
    def resolve_patients(root, info):
        return Patient.objects.all()
    def resolve_users(root, info):
        return User.objects.all()
    def resolve_configuration(root, info):
        return Configuration.objects.all()

    # Gets specified data only
    def resolve_patient_by_mrn(root, info, hospitalNumber):
        try:
            return Patient.objects.get(hospitalNumber=hospitalNumber)
        except Patient.DoesNotExist:
            return None
    def resolve_user_by_id(root, info, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

schema = graphene.Schema(query=Query, mutation=Mutation)