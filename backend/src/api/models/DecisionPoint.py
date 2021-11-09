from django.db import models

from .Patient import patient_orm
from .UserProfile import SdUser
# Database table model
class decisionpoint_orm(models.Model):
    patient=models.ForeignKey(patient_orm, on_delete=models.CASCADE)
    clinician=models.ForeignKey(SdUser, on_delete=models.CASCADE)
    type=models.TextField()
    added_at=models.DateTimeField()
    updated_at=models.DateTimeField()
    clinic_history=models.TextField()
    comorbidities=models.TextField()