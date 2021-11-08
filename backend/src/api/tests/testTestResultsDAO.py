from django.test import TestCase
from api.dao import PatientDAO, TestResultDAO
from api.models import SdUser

class TestResultDAOTests(TestCase):
    def setUp(self):

        # creating patient object
        self.patient_hospitalNumber="0123456"
        self.patient_nationalNumber="0123456"
        self.patient_communicationMethod="EMAIL"
        self.patient_firstName="JOHN"
        self.patient_lastName="DOE"
        self.patient_dateOfBirth="2000-01-01"
        self.patientDAO=PatientDAO(
            hospitalNumber=self.patient_hospitalNumber,
            nationalNumber=self.patient_nationalNumber,
            communicationMethod=self.patient_communicationMethod,
            firstName=self.patient_firstName,
            lastName=self.patient_lastName,
            dateOfBirth=self.patient_dateOfBirth
        )
        
        # creating test result object
        self.testresult_patient=self.patientDAO._orm
        self.testresult_addedAt="2020-01-01T03:00+00:00"
        self.testresult_description="clinical history here"
        self.testresult_mediaurls="comorbidities here"

        self.testresultDAO=TestResultDAO(
            patient=self.testresult_patient,
            addedAt=self.testresult_addedAt,
            description=self.testresult_description,
            mediaUrls=self.testresult_mediaurls,
        )
    
    def testRead(self):
        testResult=TestResultDAO.read(id=self.testresultDAO.id)
        self.assertTrue(testResult)
        self.assertEqual(testResult.description, self.testresult_description)
        self.assertEqual(self.patient_firstName, testResult.patient.first_name)

    def testUpdate(self):
        testResult=TestResultDAO.read(id=self.testresultDAO.id)
        testResult.description="Say hello to my new description"
        testResult.save()

        newTestResult=TestResultDAO.read(id=self.testresultDAO.id)
        self.assertEqual(testResult.description, newTestResult.description)
        self.assertEqual(self.patient_firstName, testResult.patient.first_name)

    def testDelete(self):
        testResult=TestResultDAO.read(id=self.testresultDAO.id)
        testResult.delete()
        self.assertFalse(TestResultDAO.read(self.testresultDAO.id)) # if a record isn't found, it will return false (what we want)