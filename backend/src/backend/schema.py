# from typing_extensions import Required
import graphene
from graphene_django import DjangoObjectType

from backend.api.models import Patient, User, Configuration, DecisionPoint, TestResult

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


class Query(graphene.ObjectType):
    patients = graphene.List(PatientType)
    users = graphene.List(UserType)
    configurations = graphene.List(ConfigurationType)
    decisionpoints = graphene.List(DecisionPointType)
    testresults = graphene.List(TestResultType)

    patient_by_mrn = graphene.Field(PatientType, hospitalNumber=graphene.String())

    def resolve_all_patients(root, info):
        return Patient.objects.all()
    def resolve_all_users(root, info):
        return User.objects.all()
    def resolve_all_configurations(root, info):
        return Configuration.objects.all()
    def resolve_all_decisionpoints(root, info):
        return DecisionPoint.objects.all()
    def resolve_all_testresults(root, info):
        return TestResult.objects.all()


    def resolve_patient_by_mrn(root, info, hospitalNumber):
        try:
            return Patient.objects.get(hospitalNumber=hospitalNumber)
        except Patient.DoesNotExist:
            return None

schema = graphene.Schema(query=Query)