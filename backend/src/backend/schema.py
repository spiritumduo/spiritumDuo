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


# MODIFYING EXISTING RECORDS
class ModifyPatient(graphene.Mutation):
    patient=graphene.Field(PatientType) # return object definition
    class Arguments:
        id=graphene.ID()
        hospitalNumber=graphene.String()
        nationalNumber=graphene.String()
        communicationMethod=graphene.String()
        firstName=graphene.String()
        lastName=graphene.String()
        dateOfBirth=graphene.Date()
    def mutate(self, info, id=None, hospitalNumber=None, nationalNumber=None, communicationMethod=None, firstName=None, lastName=None, dateOfBirth=None): 
        """
            Hi there, a little bit about what's going on here. I've done this like this so you only need the record ID and the data you want to change.
            Of course you can throw all the data you want at it, but I've designed it with simplicity in mind. This might backfire but we'll see.
            This will update the record of only the required data. ie, if you only wanted to change the hospital number, you'd provide the updated
            hospital number and the record ID only.

            This might bite me on the arse but it'll be easy enough to change this function to only handle objects 
            ~Joe

            PS: one thing I've just thought is this data might actually be handled by the trust integration engine but we'll cross that when we get there
        """
        patient=Patient.objects.get(id=id) # find the patient record by the id provided

        if (hospitalNumber!=None): # if argument hospitalNumber is not null
            patient.hospitalNumber=hospitalNumber # set the existing record's new hospitalNumber attribute to the described attribute provided
        if (nationalNumber!=None):
            patient.nationalNumber=nationalNumber
        if (communicationMethod!=None):
            patient.communicationMethod=communicationMethod
        if (firstName!=None):
            patient.firstName=firstName
        if (lastName!=None):
            patient.lastName=lastName
        if (dateOfBirth!=None):
            patient.dateOfBirth=dateOfBirth
        patient.save() # save the patient record to the database
        return ModifyPatient(patient=patient) # return data

class ModifyUser(graphene.Mutation):
    patient=graphene.Field(UserType)
    class Arguments:
        id=graphene.ID()
        firstName=graphene.String()
        lastName=graphene.String()
        userName=graphene.String()
        passwordHash=graphene.String()
        department=graphene.String()
        lastAccess=graphene.Date()
        roles=graphene.String()
    def mutate(self, info, firstName=None, lastName=None, userName=None, passwordHash=None, department=None, roles=None): 
        user=User.objects.get(id=id)

        if (firstName!=None):
            user.firstName=firstName 
        if (lastName!=None):
            user.lastName=lastName
        if (userName!=None):
            user.userName=userName
        if (passwordHash!=None):
            user.passwordHash=passwordHash
        if (department!=None):
            user.department=department
        if (roles!=None):
            user.roles=roles
        user.save()
        return ModifyUser(user=user)

class ModifyDecisionPoint(graphene.Mutation):
    decisionPoint=graphene.Field(DecisionPointType)
    class Arguments:
        id=graphene.ID()
        patient=graphene.String()
        addedAt=graphene.Date()
        updatedAt=graphene.Date()
        clinician=graphene.String()
        decisionType=graphene.String()
        clinicHistory=graphene.String()
        comorbidities=graphene.String()
    def mutate(self, info, patient=None, addedAt=None, updatedAt=None, clinician=None, decisionType=None, clinicHistory=None, comorbidities=None): 
        decisionPoint=DecisionPoint.objects.get(id=id)
        if (patient!=None):
            decisionPoint.patient=patient
        if (addedAt!=None):
            decisionPoint.addedAt=addedAt
        if (updatedAt!=None):
            decisionPoint.updatedAt=updatedAt
        if (clinician!=None):
            decisionPoint.clinician=clinician
        if (decisionType!=None):
            decisionPoint.decisionType=decisionType
        if (clinicHistory!=None):
            decisionPoint.clinicHistory=clinicHistory
        if (comorbidities!=None):
            decisionPoint.comorbidities=comorbidities
        decisionPoint.save()
        return ModifyDecisionPoint(decisionPoint=decisionPoint)

class ModifyTestResult(graphene.Mutation):
    testResult=graphene.Field(DecisionPointType)
    class Arguments:
        id=graphene.ID()
        patient=graphene.String()
        addedAt=graphene.Date()
        description=graphene.String()
        mediaUrls=graphene.String()
    def mutate(self, info, patient=None, addedAt=None, description=None, mediaUrls=None): 
        testResult=TestResult.objects.get(id=id)
        if (patient!=None):
            testResult.patient=patient
        if (addedAt!=None):
            testResult.addedAt=addedAt
        if (description!=None):
            testResult.description=description
        if (mediaUrls!=None):
            testResult.mediaUrls=mediaUrls
        testResult.save()
        return ModifyDecisionPoint(testResult=testResult)

# DELETING EXISTING RECORDS
class RemovePatient(graphene.Mutation):
    patient=graphene.Field(PatientType)
    class Arguments:
        id=graphene.ID()
    def mutate(self, info, id): 
        patient=Patient.objects.get(id=id).delete() # find the patient record by the id provided and remove it
        return True
class RemoveUser(graphene.Mutation):
    user=graphene.Field(UserType)
    class Arguments:
        id=graphene.ID()
    def mutate(self, info, id): 
        user=User.objects.get(id=id).delete()
        return True
class RemoveDecisionPoint(graphene.Mutation):
    decisionPoint=graphene.Field(DecisionPointType)
    class Arguments:
        id=graphene.ID()
    def mutate(self, info, id): 
        decisionPoint=DecisionPoint.objects.get(id=id).delete()
        return True
class RemoveTestResult(graphene.Mutation):
    testResult=graphene.Field(TestResultType)
    class Arguments:
        id=graphene.ID()
    def mutate(self, info, id): 
        testResult=TestResult.objects.get(id=id).delete()
        return True

class Mutation(graphene.ObjectType):
    create_patient = CreatePatient.Field()
    create_user = CreateUser.Field()
    create_decisionpoint=CreateDecisionPoint.Field()
    create_testresult=CreateTestResult.Field()

    modify_patient=ModifyPatient.Field()
    modify_user=ModifyUser.Field()
    modify_decisionpoint=ModifyDecisionPoint.Field()
    modify_testresult=ModifyTestResult.Field()

    remove_patient=RemovePatient.Field()
    remove_user=RemoveUser.Field()
    remove_decisionpoint=RemoveDecisionPoint.Field()
    remove_testresult=RemoveTestResult.Field()

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