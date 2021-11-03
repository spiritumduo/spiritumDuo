from django.db import models
from .SdUser import SdUser

class UserProfile(models.Model):

    class Meta:
        permissions = [
            ("add_remove_user_profile", "can add/remove user profiles"),
            ("read_user_profile", "can read user profiles")
        ]

    user = models.OneToOneField(
        SdUser,
        on_delete=models.RESTRICT,
        primary_key=True
    )
    department = models.CharField(max_length=1024)

