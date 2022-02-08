import logging
import requests
import httpx
import json
from SdTypes import MilestoneState
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
        
    
class TrustAdapterNotFoundException(Exception):
    """
    This is raised when a specified trust adapter
    cannot be found
    """


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

    async def create_patient(self, patient: Patient_IE = None, auth_token: str = None):
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/patient/',
                cookies={"SDSESSION": auth_token},
                json={
                    "hospital_number": patient.hospital_number,
                    "national_number": patient.national_number,
                    "communication_method": patient.communication_method,
                    "first_name": patient.first_name,
                    "last_name": patient.last_name,
                    "date_of_birth": patient.date_of_birth.isoformat(),
                }
            )
            res = res.json()
            try:
                return Patient_IE(
                    id=res['id'],
                    first_name=res['first_name'],
                    last_name=res['last_name'],
                    hospital_number=res['hospital_number'],
                    national_number=res['national_number'],
                    communication_method=res['communication_method'],
                    date_of_birth=res['date_of_birth'],
                )
            except KeyError:
                logging.warning('ress')
                logging.warning(res)
                return None

    async def load_patient(self, hospitalNumber: str = None, auth_token: str = None) -> Optional[Patient_IE]:
        result = requests.get(
            self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/patient/hospital/"+hospitalNumber,
            cookies={"SDSESSION": auth_token}
        )
        if result.status_code!=200:
            raise Exception(f"HTTP{result.status_code} received")
        record=json.loads(result.text)
        if record is not None:
            return Patient_IE(
                id=record['id'],
                first_name=record['first_name'],
                last_name=record['last_name'],
                hospital_number=record['hospital_number'],
                national_number=record['national_number'],
                communication_method=record['communication_method'],
                date_of_birth=datetime.strptime(record['date_of_birth'], "%Y-%m-%d").date()
            )
        else:
            return None

    async def load_many_patients(self, hospitalNumbers: List = None, auth_token: str = None) -> List[Optional[Patient_IE]]:
        return_list = []
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f'{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/patient/hospital/',
                cookies={"SDSESSION": auth_token},
                json=hospitalNumbers
            )

            if res.status_code != 200:
                raise Exception(f"HTTP{res.status_code} received")

            if res is not None:
                res_data = json.loads(res.text)
                for record in res_data:
                    return_list.append(
                        Patient_IE(
                            id=record['id'],
                            first_name=record['first_name'],
                            last_name=record['last_name'],
                            hospital_number=record['hospital_number'],
                            national_number=record['national_number'],
                            communication_method=record['communication_method'],
                            date_of_birth=datetime.strptime(record['date_of_birth'], "%Y-%m-%d").date()
                        )
                    )
        return return_list

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

        async with httpx.AsyncClient() as client:
            result = await client.post(
                self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/testresult",
                json=params,
                cookies={"SDSESSION": auth_token}
            )
        tieTestResult=json.loads(result.text)

        tieTestResult['added_at'] = datetime.fromisoformat(tieTestResult['added_at'])
        tieTestResult['updated_at'] = datetime.fromisoformat(tieTestResult['updated_at'])
        
        return TestResult_IE(
            **tieTestResult
        )

    async def load_test_result(self, recordId: str = None, auth_token: str = None) -> Optional[TestResult_IE]:
        async with httpx.AsyncClient() as client:
            result = await client.get(
                f"{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/testresult/{str(recordId)}",
                cookies={"SDSESSION": auth_token}
            )
        if result.status_code!=200: raise Exception(f"HTTP{result.status_code} received")

        tieTestResult=json.loads(result.text)
        tieTestResult['added_at'] = datetime.fromisoformat(tieTestResult['added_at'])
        tieTestResult['updated_at'] = datetime.fromisoformat(tieTestResult['updated_at'])
        
        return TestResult_IE(
            **tieTestResult
        )

    async def load_many_test_results(self, recordIds: List = None, auth_token: str = None) -> List[Optional[TestResult_IE]]:
        async with httpx.AsyncClient() as client:
            async with httpx.AsyncClient() as client:
                result = await client.post(
                    f"{self.TRUST_INTEGRATION_ENGINE_ENDPOINT}/testresults/get/",
                    cookies={"SDSESSION": auth_token},
                    json=recordIds
                )
            if result.status_code!=200: raise Exception(f"HTTP{result.status_code} received")

            if result is not None:
                return_list = []
                result_data = json.loads(result.text)
                for record in result_data:
                    record['added_at'] = datetime.fromisoformat(record['added_at'])
                    record['updated_at'] = datetime.fromisoformat(record['updated_at'])

                    return_list.append(
                        TestResult_IE(
                            **record
                        )
                    )
        return return_list

