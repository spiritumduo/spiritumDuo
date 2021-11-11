from django.db import models

# Database table model
class Role(models.Model):
    name=models.TextField()