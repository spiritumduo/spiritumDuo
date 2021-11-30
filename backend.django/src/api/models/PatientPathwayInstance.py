from django.db import models
from .DecisionPoint import DecisionPoint

class PatientPathwayInstance(models.Model):
    patient = models.ForeignKey('api.Patient', on_delete=models.RESTRICT)
    pathway = models.ForeignKey('api.Pathway', on_delete=models.RESTRICT)
    is_discharged = models.BooleanField(default=False)
    awaiting_decision_type = models.CharField(
        max_length=150,
        choices=DecisionPoint.DecisionPointType.choices,
        default=DecisionPoint.DecisionPointType.TRIAGE
    )
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
