from django.test import TestCase
from api.dao import PatientDAO

class PatientDAOTests(TestCase):
    def setUp(self):
        self.hospital_number="0123456"
        self.national_number="0123456"
        self.communication_method="EMAIL"
        self.first_name="JOHN"
        self.last_name="DOE"
        self.date_of_birth="2000-01-01"

        self.patient=PatientDAO(
            hospital_number=self.hospital_number,
            national_number=self.national_number,
            communication_method=self.communication_method,
            first_name=self.first_name,
            last_name=self.last_name,
            date_of_birth=self.date_of_birth
        )
        self.patient.save()

    def testRead(self):
        recordID=self.patient.id
        newPatient=PatientDAO.read(recordID)
        self.assertEqual(self.hospital_number, newPatient.hospital_number)

    def testUpdate(self):
        recordID=self.patient.id
        newPatient=PatientDAO.read(recordID)
        newPatient.first_name="JASON"
        newPatient.last_name="BOURNE"
        newPatient.save()

        self.assertEqual("JASON", newPatient.first_name)
        self.assertEqual("BOURNE", newPatient.last_name)
        self.assertNotEqual(self.first_name, newPatient.first_name)
        self.assertNotEqual(self.last_name, newPatient.last_name)

    def testDelete(self):
        recordID=self.patient.id
        patient=PatientDAO.read(searchParam=recordID)
        patient.delete()
        self.assertFalse(PatientDAO.read(searchParam=recordID))