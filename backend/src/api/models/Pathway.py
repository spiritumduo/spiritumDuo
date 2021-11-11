from django.db import models

# Database table model
class Pathway(models.Model):
    name = models.TextField()