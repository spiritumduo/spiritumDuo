from django.test import TestCase
from api.dao import UserDAO
from api.models import UserProfile, SdUser


class UserDAOTests(TestCase):
    def setUp(self):
        self.first_name = "John"
        self.last_name = "Doe"
        self.username = "johndoe1234"
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

        self.userProfile = UserProfile(
            user=self.user,
            department="Respiratory"
        )
        self.userProfile.save()

    def testRead(self):
        """Do we get back the details from the fixture?"""
        userProfile = UserDAO.read(self.userProfile.user.id)
        self.assertEqual(self.department, userProfile.department)
        self.assertEqual(self.first_name, userProfile.firstName)

    def testCreateSaveAndReadAll(self):
        """Can we add many UserProfiles and get them all back?"""
        profileDaos = []
        for i in range(0, 5):
            iStr = "-" + str(i)
            dao = UserDAO(
                firstName=self.user.first_name + iStr,
                lastName=self.user.last_name + iStr,
                username=self.user.username + iStr,
                department=self.department,
            )
            dao.save()
            profileDaos.append(dao)

        self.maxDiff = None
        userProfiles = UserDAO.readAll()
        for dao in profileDaos:
            self.assertIn(dao, userProfiles)

    def testReadChangeRead(self):
        dao = UserDAO().read(userId=self.userProfile.user_id)
        dao.firstName = "Freddy"
        dao.save()
        dao = UserDAO().read(userId=self.userProfile.user_id)
        self.assertEqual("Freddy", dao.firstName)

