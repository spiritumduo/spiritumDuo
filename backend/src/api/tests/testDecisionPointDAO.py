from django.test import TestCase
from api.dao import PatientDAO, DecisionPointDAO, UserDAO
from api.models import SdUser

class DecisionPointDAOTests(TestCase):
    def setUp(self):

        # creating patient object
        self.patient_hospitalNumber="0123456"
        self.patient_nationalNumber="0123456"
        self.patient_communicationMethod="EMAIL"
        self.patient_firstName="JOHN"
        self.patient_lastName="DOE"
        self.patient_dateOfBirth="2000-01-01"
        self.patientDAO=PatientDAO(
            hospital_number=self.patient_hospitalNumber,
            national_number=self.patient_nationalNumber,
            communication_method=self.patient_communicationMethod,
            first_name=self.patient_firstName,
            last_name=self.patient_lastName,
            date_of_birth=self.patient_dateOfBirth
        )
        self.patientDAO.save()

        # creating user/clinician object
        self.user_first_name = "John"
        self.user_last_name = "Doe"
        self.user_username = "johndoe1234"
        self.user_password = "somePasswordHash"
        self.user_is_staff = False
        self.user_is_superuser = False
        self.userDAO = SdUser(
            first_name=self.user_first_name,
            last_name=self.user_last_name,
            username=self.user_username,
            password=self.user_password,
            is_staff=self.user_is_staff,
            is_superuser=self.user_is_superuser,
        )
        self.userDAO.save()
        
        # creating decision point object
        self.decisionpoint_patient=self.patientDAO._orm
        self.decisionpoint_clinician=self.userDAO
        self.decisionpoint_type="TRIAGE"
        self.decisionpoint_addedAt="2020-01-01T03:00+00:00"
        self.decisionpoint_updatedAt="2020-01-01T03:30+00:00"
        self.decisionpoint_clinicHistory="clinical history here"
        self.decisionpoint_comorbidities="comorbidities here"

        self.decisionpointDAO=DecisionPointDAO(
            patient=self.decisionpoint_patient,
            clinician=self.decisionpoint_clinician,
            type=self.decisionpoint_type,
            added_at=self.decisionpoint_addedAt,
            updated_at=self.decisionpoint_updatedAt,
            clinic_history=self.decisionpoint_clinicHistory,
            comorbidities=self.decisionpoint_comorbidities
        )
        self.decisionpointDAO.save()

    def testRead(self):
        decisionPoint=DecisionPointDAO.read(id=self.decisionpointDAO.id)
        self.assertTrue(decisionPoint)

    def testUpdate(self):
        decisionPoint=DecisionPointDAO.read(id=self.decisionpointDAO.id)
        decisionPoint.clinic_history="we're adding even more data"
        decisionPoint.comorbidities="I don't know what to put here, it just has to be different"
        decisionPoint.save()

        newDecisionPoint=DecisionPointDAO.read(id=self.decisionpointDAO.id)
        self.assertEqual(decisionPoint.clinic_history, newDecisionPoint.clinic_history)
        self.assertEqual(decisionPoint.comorbidities, newDecisionPoint.comorbidities)

    def testDelete(self):
        decisionPoint=DecisionPointDAO.read(id=self.decisionpointDAO.id)
        decisionPoint.delete()
        self.assertFalse(DecisionPointDAO.read(self.decisionpointDAO.id))