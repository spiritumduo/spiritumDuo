from django.db import models
from enum import Enum
from .Patient import Patient
from .Pathway import Pathway
from .UserProfile import SdUser

class DecisionPoint(models.Model):
    class DecisionPointType(models.TextChoices):
        TRIAGE="TRIAGE"
        CLINIC="CLINIC"
    patient=models.ForeignKey(Patient, on_delete=models.CASCADE)
    clinician=models.ForeignKey(SdUser, on_delete=models.CASCADE)
    pathway=models.ForeignKey(Pathway, on_delete=models.CASCADE)
    type=models.CharField(
        choices=DecisionPointType.choices,
        default=DecisionPointType.TRIAGE,
        max_length=10,
    )
    added_at=models.DateTimeField()
    updated_at=models.DateTimeField()
    clinic_history=models.TextField()
    comorbidities=models.TextField()