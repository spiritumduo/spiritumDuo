from django.db import models

# Database table model
class pathway_orm(models.Model):
    name = models.TextField()