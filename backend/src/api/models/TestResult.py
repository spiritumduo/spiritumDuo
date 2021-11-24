from django.db import models
from .Patient import Patient
from .PatientPathwayInstance import PatientPathwayInstance

class TestResult(models.Model):
    patient=models.ForeignKey(
        to=Patient,
        on_delete=models.CASCADE
    )
    pathway_instance=models.ForeignKey(
        to=PatientPathwayInstance,
        on_delete=models.CASCADE
    )
    added_at=models.DateTimeField(auto_now=True)
    description=models.TextField()

class TestResultMedia(models.Model):
    test_result=models.ForeignKey(
        to=TestResult,
        on_delete=models.CASCADE
    )
    resource_path=models.TextField()