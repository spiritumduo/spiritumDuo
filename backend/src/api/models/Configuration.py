from django.db import models

# Database table model
class Configuration(models.Model):
    hospital_number_name=models.TextField()
    hospital_number_regex=models.TextField()
    national_patient_number_name=models.TextField()
    national_patient_number_regex=models.TextField()