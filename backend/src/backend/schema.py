import graphene
from graphene import InputObjectType
from graphene_django.types import DjangoObjectType
import json
from backend.api.models import Patient, User, Configuration, DecisionPoint, TestResult, DecisionPointTypes, Role

class PatientType(DjangoObjectType):
    class Meta:
        model = Patient
        fields = ("id", "hospitalNumber", "nationalNumber", "communicationMethod", "firstName", "lastName", "dateOfBirth")

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "firstName", "lastName", "userName", "passwordHash", "department", "lastAccess", "roles")

class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        fields = ("id", "roleName")

class RoleInput(InputObjectType):
    id=graphene.ID()
    roleName=graphene.String() 

class ConfigurationType(DjangoObjectType):
    class Meta:
        model = Configuration
        fields = ("hospitalNumberName","hospitalNumberRegex","nationalPatientNumberName","nationalPatientNumberRegex")

class DecisionPointType(DjangoObjectType):
    class Meta:
        model = DecisionPoint
        fields = ("id","patient","addedAt","updatedAt","clinician","decisionType","clinicHistory","comorbidities")

class TestResultType(DjangoObjectType):
    class Meta:
        model = TestResult
        fields = ("id","patient","addedAt","description","mediaUrls")

# CREATING NEW RECORDS
class CreatePatient(graphene.Mutation): # Create class inheriting mutation class
    newPatient=graphene.Field(PatientType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        id=graphene.ID()
        hospitalNumber=graphene.String()
        nationalNumber=graphene.String()
        communicationMethod=graphene.String()
        firstName=graphene.String()
        lastName=graphene.String()
        dateOfBirth=graphene.Date() # YYYY-MM-DD
    def mutate(self, info, id, hospitalNumber, nationalNumber, communicationMethod, firstName, lastName, dateOfBirth): # function to handle mutation
        newPatient=Patient(id=id, hospitalNumber=hospitalNumber, nationalNumber=nationalNumber, communicationMethod=communicationMethod, firstName=firstName, lastName=lastName, dateOfBirth=dateOfBirth) # create patient object based off data provided
        newPatient.save() # save patient record to database
        return CreatePatient(newPatient=newPatient) # return data

'''
TODO:
- Each major data type (patient, user, etc) has to be an input type. This is so it can be used as part of a nested mutation.
'''

class CreateUser(graphene.Mutation):
    user=graphene.Field(UserType)
    class Arguments:
        id=graphene.ID()
        firstName=graphene.String()
        lastName=graphene.String()
        userName=graphene.String()
        passwordHash=graphene.String()
        department=graphene.String()
        lastAccess=graphene.Date()
        roles=graphene.List(RoleInput)
    def mutate(self, info, id, firstName, lastName, userName, passwordHash, department, lastAccess, roles):
        newUser=User(id=id, firstName=firstName, lastName=lastName, userName=userName, passwordHash=passwordHash, department=department, lastAccess=lastAccess)
        newUser.save()
        for role in roles:
            newUser.roles.create(id=role.id, roleName=role.roleName)
        return CreateUser(user=newUser)

class CreateConfiguration(graphene.Mutation):
    configuration=graphene.Field(ConfigurationType)
    class Arguments:
        hospitalNumberName=graphene.String()
        hospitalNumberRegex=graphene.String()
        nationalPatientNumberName=graphene.String()
        nationalPatientNumberRegex=graphene.String()
    def mutate(self, info, hospitalNumberName, hospitalNumberRegex, nationalPatientNumberName, nationalPatientNumberRegex):
        newConfig=Configuration(hospitalNumberName=hospitalNumberName, hospitalNumberRegex=hospitalNumberRegex, nationalPatientNumberName=nationalPatientNumberName, nationalPatientNumberRegex=nationalPatientNumberRegex)
        newConfig.save()
        return CreateConfiguration(Configuration=newConfig)

class CreateDecisionPoint(graphene.Mutation):
    decisionPoint=graphene.Field(DecisionPointType)
    class Arguments:
        id=graphene.ID()
        patient=graphene.Argument(PatientType)
        addedAt=graphene.Date()
        updatedAt=graphene.Date()
        clinician=graphene.Argument(UserType)
        # decisionType = graphene.Enum("decisionType", [("TRIAGE", 1), ("CLINIC", 2), ("MDT", 3), ("AD_HOC", 4), ("FOLLOW_UP", 5)])
        decisionType=graphene.String()
        clinicHistory=graphene.String()
        comorbidities=graphene.String()

    def mutate(self, info, id, patient, addedAt, updatedAt, clinician, decisionType, clinicHistory, comorbidities):
        newDP=DecisionPoint(id=id, patient=patient, addedAt=addedAt, updatedAt=updatedAt, clinician=clinician, decisionType=decisionType, clinicHistory=clinicHistory, comorbidities=comorbidities)
        newDP.save()
        return CreateDecisionPoint(decisionPoint=newDP)

class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()
    create_user = CreateUser.Field()
    create_configuration=CreateConfiguration.Field()
    create_decisionpoint=CreateDecisionPoint.Field()

class Query(graphene.ObjectType):
    patients = graphene.List(PatientType)
    users = graphene.List(UserType)

    patient_by_mrn = graphene.Field(PatientType, hospitalNumber=graphene.String())
    user_by_id=graphene.Field(UserType, id=graphene.Int())

    # Gets all data 
    def resolve_patients(root, info):
        return Patient.objects.all()
    def resolve_users(root, info):
        return User.objects.all()
    def resolve_configurations(root, info):
        return Configuration.objects.all()
    def resolve_decisionpoints(root, info):
        return DecisionPoint.objects.all()
    def resolve_testresults(root, info):
        return TestResult.objects.all()

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