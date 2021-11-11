from django.db import models

# Database table model
class Pathway(models.Model):
    name = models.TextField()
    type = models.TextField()
    is_discharged = models.BooleanField()