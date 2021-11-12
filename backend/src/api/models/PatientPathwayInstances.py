from django.db import models
from .DecisionPoint import DecisionPoint


class PatientPathwayInstances(models.Model):
    patient = models.ForeignKey('api.Patient', on_delete=models.RESTRICT)
    pathway = models.ForeignKey('api.Pathway', on_delete=models.RESTRICT)
    isDischarged = models.BooleanField(default=False)
    awaitingDecisionType = models.CharField(
        max_length=150,
        choices=DecisionPoint.DecisionPointType.choices
    )
