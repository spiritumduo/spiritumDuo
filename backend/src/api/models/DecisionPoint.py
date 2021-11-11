from django.db import models

from .Patient import Patient
from .Pathway import Pathway
from .UserProfile import SdUser
# Database table model
class DecisionPoint(models.Model):
    patient=models.ForeignKey(Patient, on_delete=models.CASCADE)
    clinician=models.ForeignKey(SdUser, on_delete=models.CASCADE)
    pathway=models.ForeignKey(Pathway, on_delete=models.CASCADE)
    type=models.TextField()
    added_at=models.DateTimeField()
    updated_at=models.DateTimeField()
    clinic_history=models.TextField()
    comorbidities=models.TextField()