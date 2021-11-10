from django.db import models
from .Pathway import pathway_orm
# Database table model

class pathway_patient_link_orm(models.Model):
    patient=models.ForeignKey('patient_orm', on_delete=models.CASCADE)
    pathway=models.ForeignKey('pathway_orm', on_delete=models.CASCADE)

class patient_orm(models.Model):
    hospital_number = models.TextField()
    national_number = models.TextField()
    communication_method = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()
    pathways = models.ManyToManyField(pathway_orm, through=pathway_patient_link_orm)