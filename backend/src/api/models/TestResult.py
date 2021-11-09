from django.db import models

from .Patient import patient_orm
# Database table model
class testresult_orm(models.Model):
    patient=models.ForeignKey(
        to=patient_orm,
        on_delete=models.CASCADE
    )
    added_at=models.DateTimeField()
    description=models.TextField()
    media_urls=models.TextField()