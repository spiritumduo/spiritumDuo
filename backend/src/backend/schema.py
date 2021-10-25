# from typing_extensions import Required
import graphene
from graphene_django import DjangoObjectType

from backend.api.models import Patient, User, Configuration, DecisionPoint, TestResult, DecisionPointDecisionType

class PatientType(DjangoObjectType):
    class Meta:
        model = Patient
        fields = ("id", "hospitalNumber", "nationalNumber", "communicationMethod", "firstName", "lastName", "dateOfBirth")

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "firstName", "lastName", "userName", "passwordHash", "department", "lastAccess", "roles")
        
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

class CreatePatient(graphene.Mutation):
    newPatient=graphene.Field(PatientType)
    class Arguments:
        id=graphene.ID()
        hospitalNumber=graphene.String()
        nationalNumber=graphene.String()
        communicationMethod=graphene.String()
        firstName=graphene.String()
        lastName=graphene.String()
        dateOfBirth=graphene.Date()
    def mutate(self, info, id, hospitalNumber, nationalNumber, communicationMethod, firstName, lastName, dateOfBirth):
        newPatient=Patient(id=id, hospitalNumber=hospitalNumber, nationalNumber=nationalNumber, communicationMethod=communicationMethod, firstName=firstName, lastName=lastName, dateOfBirth=dateOfBirth)
        newPatient.save()
        return CreatePatient(newPatient=newPatient)

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
        roles=graphene.String()
    def mutate(self, info, id, firstName, lastName, userName, passwordHash, department, lastAccess, roles):
        newUser=User(id=id, firstName=firstName, lastName=lastName, userName=userName, passwordHash=passwordHash, department=department, lastAccess=lastAccess, roles=roles)
        newUser.save()
        return CreateUser(user=newUser)

class CreateDecisionPoint(graphene.Mutation):
    decisionPoint=graphene.Field(DecisionPointType)
    class Arguments:
        id=graphene.ID()
        patient=graphene.String()
        addedAt=graphene.Date()
        updatedAt=graphene.Date()
        clinician=graphene.String()
        # decisionType=graphene.Field(DecisionPointDecisionType) # NOTE: see comment in ./api/models.py ~Joe
        decisionType=graphene.String()
        clinicHistory=graphene.String()
        comorbidities=graphene.String()

    def mutate(self, info, id, patient, addedAt, updatedAt, clinician, decisionType, clinicHistory, comorbidities):
        newDP=DecisionPoint(id=id, patient=patient, addedAt=addedAt, updatedAt=updatedAt, clinician=clinician, decisionType=decisionType, clinicHistory=clinicHistory, comorbidities=comorbidities)
        newDP.save()
        return CreateUser(decisionPoint=newDP)

class CreateTestResult(graphene.Mutation):
    testResult=graphene.Field(TestResultType)
    class Arguments:
        id=graphene.ID()
        patient=graphene.String()
        addedAt=graphene.Date()
        description=graphene.String()
        mediaUrls=graphene.String()
    def mutate(self, info, id, patient, addedAt, description, mediaUrls):
        newTestResult=DecisionPoint(id=id, patient=patient, addedAt=addedAt, description=description, mediaUrls=mediaUrls)
        newTestResult.save()
        return CreateUser(testResult=newTestResult)

class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()
    create_user = CreateUser.Field()
    create_decisionpoint=CreateDecisionPoint.Field()
    create_testresult=CreateTestResult.Field()

class Query(graphene.ObjectType):
    patients = graphene.List(PatientType)
    users = graphene.List(UserType)
    configurations = graphene.List(ConfigurationType)
    decisionpoints = graphene.List(DecisionPointType)
    testresults = graphene.List(TestResultType)

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