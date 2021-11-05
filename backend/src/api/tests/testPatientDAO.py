from django.test import TestCase
from api.dao import PatientDAO

class PatientDAOTests(TestCase):
    def setUp(self):
        self.hospitalNumber="0123456"
        self.nationalNumber="0123456"
        self.communicationMethod="EMAIL"
        self.firstName="JOHN"
        self.lastName="DOE"
        self.dateOfBirth="2000-01-01"

        self.patient=PatientDAO(
            hospitalNumber=self.hospitalNumber,
            nationalNumber=self.nationalNumber,
            communicationMethod=self.communicationMethod,
            firstName=self.firstName,
            lastName=self.lastName,
            dateOfBirth=self.dateOfBirth
        )

    def testRead(self):
        recordID=self.patient.id
        newPatient=PatientDAO.read(recordID)
        self.assertEqual(self.hospitalNumber, newPatient.hospitalNumber)

    def testUpdate(self):
        recordID=self.patient.id
        newPatient=PatientDAO.read(recordID)
        newPatient.firstName="JASON"
        newPatient.lastName="BOURNE"
        newPatient.save()

        self.assertEqual("JASON", newPatient.firstName)
        self.assertEqual("BOURNE", newPatient.lastName)
        self.assertNotEqual(self.firstName, newPatient.firstName)
        self.assertNotEqual(self.lastName, newPatient.lastName)

    def testDelete(self):
        recordID=self.patient.id
        patient=PatientDAO.read(recordID)
        patient.delete()
        self.assertFalse(PatientDAO.read(recordID))
