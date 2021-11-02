import datetime
from django.test import TestCase
from api.models import SdUser, UserProfile


class TestUserProfile(TestCase):
    def setUp(self):
        self.first_name = "John",
        self.last_name = "Doe",
        self.username = "johndoe1234",
        self.password = "somePasswordHash"
        self.department = "Respiratory"
        self.is_staff = False
        self.is_superuser = False
        self.user = SdUser(
            first_name=self.first_name,
            last_name=self.last_name,
            username=self.username,
            password=self.password,
            is_staff=self.is_staff,
            is_superuser=self.is_superuser,
        )
        self.user.save()

    def testCreateAndDelete(self):
        """Creates with User relation and deletes"""
        userProfile = UserProfile(
            user=self.user,
            department="Respiratory"
        )
        userProfile.save()
        userProfile.delete()
        result = UserProfile.objects.filter(user=self.user)
        self.assertNotIn(userProfile, result)


