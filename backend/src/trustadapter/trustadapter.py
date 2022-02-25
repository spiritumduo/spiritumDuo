import logging
import httpx
import json
from models import MilestoneType
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import date, datetime
from dataclasses import dataclass

@dataclass
class Patient_IE:
    id: int = None
    first_name: str = None
    last_name: str = None
    hospital_number: str = None
    national_number: str = None
    communication_method: str = None
    date_of_birth: date = None

@dataclass
class TestResultRequest_IE:
    type_id: int = None
    current_state: str = None
    added_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    description: str = None

@dataclass
class TestResult_IE:
    id: int = None,
    description: str = None
    type_reference_name: str = None
    current_state: str = None
    added_at: datetime = None
    updated_at: datetime = None

class TrustAdapter(ABC):
    """
    Integration Engine Abstract Base Class
    This class represents the interface SD uses to communicate with a backend hospital system.
    """

    @abstractmethod
    async def test_connection(self, auth_token: str = None):
        """
        Tests the connection to the trust integration engine
        :return: Boolean success state of connection
        """

    @abstractmethod
    async def create_patient(self, patient: Patient_IE, auth_token: str = None):
        """
        Create a patient on the trust
        :param auth_token: Auth token string to pass to backend
        :param patient: Patient to input
        :return: String ID of created patient
        """
        
    @abstractmethod
    async def load_patient(self, hospitalNumber: str = None, auth_token: str = None) -> Optional[Patient_IE]:
        """
        Load single patient
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumber: String ID of patient
        :return: Patient if found, null if not
        """

    @abstractmethod
    async def load_many_patients(self, hospitalNumbers:List=None, auth_token: str = None) -> List[Optional[Patient_IE]]:
        """
        Load many patients
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumbers: List of patient ids to load
        :return: List of patients, or empty list if none found
        """

    @abstractmethod
    async def create_test_result(self, testResult: TestResultRequest_IE = None, auth_token: str = None) -> TestResult_IE:
        """
        Create a test result
        :param auth_token: Auth token string to pass to backend
        :param testResult: Test result to create
        :return: String ID of created test result
        """

    @abstractmethod
    async def load_test_result(self, recordId: str = None, auth_token: str = None) -> Optional[TestResult_IE]:
        """
        Load a test result
        :param auth_token: Auth token string to pass to backend
        :param recordId: ID of test result to load
        :return: Test result, or null if test result not found
        """

    @abstractmethod
    async def load_many_test_results(self, recordIds: str = None, auth_token: str = None) -> List[Optional[TestResult_IE]]:
        """
        Load many test results
        :param auth_token: Auth token string to pass to backend
        :param recordIds: IDs of test results to load
        :return: List of test results, or empty list if none found
        """
        
    
class TrustIntegrationCommunicationError(Exception):
    """
    This is raised when the connection to the trust adapter
    fails or times out
    """

async def httpRequest(method:str, endpoint:str, json:str={}, cookies:dict={}):
    try:
        async with httpx.AsyncClient() as client:
            if method=="post":
                response=await client.post(
                    endpoint,
                    json=json,
                    cookies=cookies
                )
            elif method=="get":
                response=await client.get(
                    endpoint,
                    cookies=cookies
                )
            
            response.raise_for_status()
            return response

    except httpx.HTTPStatusError as e:
        raise TrustIntegrationCommunicationError(f"Connection to TIE gave HTTP error: {response.status_code}")
    except httpx.TimeoutException as e:
        raise TrustIntegrationCommunicationError(f"Connection to TIE timed out ({e})")
    except httpx.NetworkError as e:
        raise TrustIntegrationCommunicationError(f"Connection to TIE failed ({e})")

class PseudoTrustAdapter(TrustAdapter):
    """
    Pseudo Integration Engine

    This is the Integration Engine implementation for the pseudo-trust backend.
    """

    def __init__(self):
        """
        Constructor
        """
        self.TRUST_INTEGRATION_ENGINE_ENDPOINT="http://sd-pseudotie:8081"

    async def test_connection(self, auth_token: str = None):
        return await httpRequest("post", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/test/', cookies={"SDSESSION": auth_token})

    async def create_patient(self, patient: Patient_IE = None, auth_token: str = None):
        json={
            "hospital_number": patient.hospital_number,
            "national_number": patient.national_number,
            "communication_method": patient.communication_method,
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "date_of_birth": patient.date_of_birth.isoformat(),
        }
        patientRecord=await httpRequest("post", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/patient/', json=json, cookies={"SDSESSION": auth_token})
        if not patientRecord:
            return None
        patientRecord=patientRecord.json()

        if patientRecord is None: return None

        return Patient_IE(
            id=patientRecord['id'],
            first_name=patientRecord['first_name'],
            last_name=patientRecord['last_name'],
            hospital_number=patientRecord['hospital_number'],
            national_number=patientRecord['national_number'],
            communication_method=patientRecord['communication_method'],
            date_of_birth=patientRecord['date_of_birth'],
        )

    async def load_patient(self, hospitalNumber: str = None, auth_token: str = None) -> Optional[Patient_IE]:
        patientRecord=await httpRequest("get", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/patient/hospital/{hospitalNumber}', cookies={"SDSESSION": auth_token})
        if not patientRecord:
            return None
        patientRecord=patientRecord.json()

        if patientRecord is None: return None
        return Patient_IE(
            id=patientRecord['id'],
            first_name=patientRecord['first_name'],
            last_name=patientRecord['last_name'],
            hospital_number=patientRecord['hospital_number'],
            national_number=patientRecord['national_number'],
            communication_method=patientRecord['communication_method'],
            date_of_birth=date.fromisoformat(patientRecord['date_of_birth'])
        )

    async def load_many_patients(self, hospitalNumbers: List = None, auth_token: str = None) -> List[Optional[Patient_IE]]:
        patientList=await httpRequest("post", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/patient/hospital/', json=hospitalNumbers, cookies={"SDSESSION": auth_token})
        if not patientList:
            return {}
        patientList=patientList.json()

        patientObjectList = []
        for patientRecord in patientList:
            patientObjectList.append(
                Patient_IE(
                    id=patientRecord['id'],
                    first_name=patientRecord['first_name'],
                    last_name=patientRecord['last_name'],
                    hospital_number=patientRecord['hospital_number'],
                    national_number=patientRecord['national_number'],
                    communication_method=patientRecord['communication_method'],
                    date_of_birth=date.fromisoformat(patientRecord['date_of_birth'])
                )
            )
        return patientObjectList

    async def create_test_result(self, testResult: TestResultRequest_IE, auth_token: str = None) -> TestResult_IE:
        params={}
        milestoneType:MilestoneType=await MilestoneType.get(int(testResult.type_id))
        params['typeReferenceName'] = milestoneType.ref_name

        if testResult.current_state:
            params['currentState'] = testResult.current_state.value
        if testResult.added_at:
            params['addedAt'] = testResult.added_at.isoformat()
        if testResult.updated_at:
            params['updatedAt'] = testResult.updated_at.isoformat()
        if testResult.description:
            params['description'] = testResult.description

        testResultRecord=await httpRequest("post", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/testresult', json=params, cookies={"SDSESSION": auth_token})
        if not testResultRecord:
            return None
        testResultRecord=testResultRecord.json()
            
        testResultRecord['added_at'] = datetime.fromisoformat(testResultRecord['added_at'])
        testResultRecord['updated_at'] = datetime.fromisoformat(testResultRecord['updated_at'])
        
        return TestResult_IE(
            **testResultRecord
        )

    async def load_test_result(self, recordId: str = None, auth_token: str = None) -> Optional[TestResult_IE]:
        testResultRecord=await httpRequest("get", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/testresult/{str(recordId)}', cookies={"SDSESSION": auth_token})
        if testResultRecord is None:
            return None
        testResultRecord=testResultRecord.json()

        testResultRecord['added_at'] = datetime.fromisoformat(testResultRecord['added_at'])
        testResultRecord['updated_at'] = datetime.fromisoformat(testResultRecord['updated_at'])
        
        return TestResult_IE(
            **testResultRecord
        )

    async def load_many_test_results(self, recordIds: List = None, auth_token: str = None) -> List[Optional[TestResult_IE]]:
        testResultList=await httpRequest("post", f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/testresults/get/', json=recordIds, cookies={"SDSESSION": auth_token})
        if testResultList is None:
            return {}
        testResultList=testResultList.json()

        testResultObjectList = []
        for record in testResultList:
            record['added_at'] = datetime.fromisoformat(record['added_at'])
            record['updated_at'] = datetime.fromisoformat(record['updated_at'])

            testResultObjectList.append(
                TestResult_IE(
                    **record
                )
            )
        return testResultObjectList
