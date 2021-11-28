from django.db import models
from django.utils.translation import gettext_lazy as _

class Patient(models.Model):
    class CommunicationMethod(models.TextChoices):
        LETTER = "LETTER", _("Letter")
        EMAIL = "EMAIL", _("Email")
        LANDLINE = "LANDLINE", _("Landline")
        MOBILE = "MOBILE", _("Mobile")
    id=models.BigAutoField(primary_key=True)
    hospital_number = models.CharField(unique=True, max_length=50)
    national_number = models.CharField(unique=True, max_length=50)
    communication_method = models.CharField(
        choices=CommunicationMethod.choices,
        default=CommunicationMethod.LETTER,
        max_length=25
    )
    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()