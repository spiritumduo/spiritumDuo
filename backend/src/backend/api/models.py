from django.db import models
from django.db.models.fields import related
import graphene
from graphene.types import field
from enum import Enum

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

class Role(models.Model):
    id=models.IntegerField(primary_key=True)
    roleName=models.TextField()

    def __str__(self):
        return self.roleName

class User(models.Model):
    id=models.IntegerField(primary_key=True)
    firstName=models.TextField()
    lastName=models.TextField()
    userName=models.TextField()
    passwordHash=models.TextField()
    department=models.TextField()
    lastAccess=models.DateTimeField()
    roles=models.ManyToManyField(Role, through="UserRolesBind")
    
    def __str__(self):
        return self.id

class UserRolesBind(models.Model):
    role=models.ForeignKey(Role, on_delete=models.CASCADE)
    user=models.ForeignKey(User, on_delete=models.CASCADE)

class Configuration(models.Model):
    hospitalNumberName=models.TextField()
    hospitalNumberRegex=models.TextField()
    nationalPatientNumberName=models.TextField()
    nationalPatientNumberRegex=models.TextField()
    
    def __str__(self):
        return self.hospitalNumberName

class DecisionPointTypes(Enum):
    TRIAGE=1
    CLINIC=2
    MDT=3
    AD_HOC=4
    FOLLOW_UP=5

class DecisionPoint(models.Model):
    id=models.IntegerField(primary_key=True)
    patient=models.ForeignKey(Patient, on_delete=models.CASCADE)
    addedAt=models.DateTimeField()
    updatedAt=models.DateTimeField()
    clinician=models.ForeignKey(User, on_delete=models.CASCADE)
    DecisionPointTypes = models.CharField(
      max_length=5,
      choices=[(tag, tag.value) for tag in DecisionPointTypes]
    )
    clinicHistory=models.TextField()
    comorbidities=models.TextField()
    
    def __str__(self):
        return self.id

class TestResult(models.Model):
    id=models.IntegerField(primary_key=True)
    patient=models.ManyToManyField(Patient)
    addedAt=models.DateTimeField()
    description=models.TextField()
    mediaUrls=models.TextField()
    
    def __str__(self):
        return self.id