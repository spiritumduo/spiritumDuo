from django.db import models

class Patient(models.Model):
    id=models.BigAutoField(primary_key=True)
    hospital_number = models.IntegerField(unique=True)
    national_number = models.IntegerField()
    communication_method = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()