from django.db import models
from .SdUser import SdUser

class UserProfile(models.Model):
    user = models.OneToOneField(
        SdUser,
        on_delete=models.RESTRICT,
        primary_key=True
    )
    department = models.TextField()

