from django.db import models
from .Pathway import Pathway
# Database table model

class PathwayPatient(models.Model):
    patient=models.ForeignKey('api.Patient', on_delete=models.CASCADE)
    pathway=models.ForeignKey('api.Pathway', on_delete=models.CASCADE)

class Patient(models.Model):
    hospital_number = models.TextField()
    national_number = models.TextField()
    communication_method = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()
    pathways = models.ManyToManyField(Pathway, through=PathwayPatient)