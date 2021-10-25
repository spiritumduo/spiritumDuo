from django.db import models
import graphene

# Create your models here.
class Patient(models.Model):
    id=models.IntegerField(primary_key=True)
    hospitalNumber=models.TextField()
    nationalNumber=models.TextField()
    communicationMethod=models.TextField()
    firstName=models.TextField()
    lastName=models.TextField()
    dateOfBirth=models.DateField()
    
    def __str__(self):
        return self.id

class User(models.Model):
    id=models.IntegerField(primary_key=True)
    firstName=models.TextField()
    lastName=models.TextField()
    userName=models.TextField()
    passwordHash=models.TextField()
    department=models.TextField()
    lastAccess=models.DateTimeField()
    roles=models.TextField()
    
    def __str__(self):
        return self.id

class Configuration(models.Model):
    hospitalNumberName=models.TextField()
    hospitalNumberRegex=models.TextField()
    nationalPatientNumberName=models.TextField()
    nationalPatientNumberRegex=models.TextField()
    
    def __str__(self):
        return self.hospitalNumberName

class DecisionPointDecisionType(graphene.Enum):
    TRIAGE=1
    CLINIC=2
    MDT=3
    AD_HOC=4
    FOLLOW_UP=5

class DecisionPoint(models.Model):
    id=models.IntegerField(primary_key=True)
    patient=models.TextField()
    addedAt=models.DateTimeField()
    updatedAt=models.DateTimeField()
    clinician=models.TextField()
    # decisionType=models.Field(DecisionPointDecisionType)
    # TODO: implement 'decisionType' to use enum, errors parsing using this method ~Joe
    decisionType=models.TextField()
    clinicHistory=models.TextField()
    comorbidities=models.TextField()
    
    def __str__(self):
        return self.id

class TestResult(models.Model):
    id=models.IntegerField(primary_key=True)
    patient=models.TextField()
    addedAt=models.DateTimeField()
    description=models.TextField()
    mediaUrls=models.TextField()
    
    def __str__(self):
        return self.id