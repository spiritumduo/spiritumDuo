from django.db import models
from .Patient import Patient


# Database table model
class TestResult(models.Model):
    patient=models.ForeignKey(
        to=Patient,
        on_delete=models.CASCADE
    )
    added_at=models.DateTimeField()
    description=models.TextField()
    media_urls=models.TextField()