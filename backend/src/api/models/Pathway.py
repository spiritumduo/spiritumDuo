from django.db import models

class Pathway(models.Model):
    name = models.TextField()
    type = models.TextField()
    is_discharged = models.BooleanField()