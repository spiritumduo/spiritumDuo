import requests
import json
from models import Milestone, Patient
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import date

class IntegrationEngine(ABC):
    """
    Integration Engine Abstract Base Class
    This class represents the interface SD uses to communicate with a backend hospital system.
    """

    @abstractmethod
    async def load_patient(self, hospitalNumber: str = None) -> Optional[Patient]:
        """
        Load single patient
        :param record_id: String ID of patient
        :return: Patient if found, null if not
        """

    async def load_many_patients(self, hospitalNumbers:List=None) -> List[Optional[Patient]]:
        """
        Load many patients
        :param record_ids: List of patient ids to load
        :return: List of patients, or empty list if none found
        """

    @abstractmethod
    async def create_milestone(self, milestone: Milestone = None) -> Milestone:
        """
        Create a Milestone
        :param milestone: Milestone to create
        :return: String ID of created milestone
        """

    @abstractmethod
    async def load_milestone(self, recordId: str = None) -> Optional[Milestone]:
        """
        Load a Milestone
        :param record_id: ID of milestone to load
        :return: Milestone, or null if milestone not found
        """

    @abstractmethod
    async def load_many_milestones(self, recordIds: str = None) -> List[Optional[Milestone]]:
        """
        Load many milestones
        :param record_ids: IDs of milestones to load
        :return: List of milestones, or empty list if none found
        """
        

class Patient_IE:
    def __init__(self, 
        id:int=None, 
        first_name:str=None, 
        last_name:str=None, 
        hospital_number:str=None,
        national_number:str=None, 
        communication_method:str=None,
        date_of_birth:date=None
    ):
        self.id=id
        self.first_name=first_name
        self.last_name=last_name
        self.hospital_number=hospital_number
        self.national_number=national_number
        self.communication_method=communication_method
        self.date_of_birth=date_of_birth

class Milestone_IE:
    def __init__(self, 
        id:int=None,
        patient_hospital_number:str=None, 
        milestone_type_id:str=None, 
        current_state:str=None, 
        added_at:date=None, 
        updated_at:date=None
    ):
        self.id=id
        self.patient_hospital_number=patient_hospital_number
        self.milestone_type_id=milestone_type_id
        self.current_state=current_state
        self.added_at=added_at
        self.updated_at=updated_at
       
    


class PseudoIntegrationEngine(IntegrationEngine):
    """
    Pseudo Integration Engine

    This is the Integration Engine implementation for the pseudo-trust backend.
    """

    def __init__(self, auth_token: str = None):
        """
        Constructor. Requires an authentication token.
        :param auth_token: String token to be supplied to pseudo-trust with each request
        """
        self.authToken = auth_token
        self.TRUST_INTEGRATION_ENGINE_ENDPOINT="http://sd-pseudotie:8081"

    async def load_patient(self, hospitalNumber: str = None) -> Optional[Patient]:
        result = requests.get(self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/patient/hospital/"+hospitalNumber, cookies={"SDSESSION":self.authToken})
        if result.status_code!=200:
            raise Exception(f"HTTP{result.status_code} received")
        record=json.loads(result.text)
        return Patient_IE(
            id=record['id'],
            first_name=record['first_name'], 
            last_name=record['last_name'], 
            hospital_number=record['hospital_number'], 
            national_number=record['national_number'], 
            communication_method=record['communication_method'],
            date_of_birth=record['date_of_birth']
        )

    async def load_many_patients(self, hospitalNumbers: List = None) -> List[Optional[Patient]]:
        retVal=[]
        for hospNo in hospitalNumbers:
            result = requests.get(self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/patient/hospital/"+hospNo, cookies={"SDSESSION":self.authToken})
            if result.status_code!=200:
                raise Exception(f"HTTP{result.status_code} received")
            record=json.loads(result.text)
            retVal.append(
                Patient_IE(
                    id=record['id'],
                    first_name=record['first_name'], 
                    last_name=record['last_name'], 
                    hospital_number=record['hospital_number'], 
                    national_number=record['national_number'], 
                    communication_method=record['communication_method'],
                    date_of_birth=record['date_of_birth']
                )
            )
        return retVal

    async def create_milestone(self, milestone: Milestone = None) -> str:
        pass

    async def load_milestone(self, recordId: str = None) -> Optional[Milestone]:
        result = requests.get(self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/milestone/"+str(recordId), cookies={"SDSESSION":self.authToken})
        if result.status_code!=200:
            raise Exception(f"HTTP{result.status_code} received")
        record=json.loads(result.text)
        return Milestone_IE(
            id=record['id'],
            patient_hospital_number=record['patient_hospital_number'],
            milestone_type_id=record['milestone_type_id'],
            current_state=record['current_state'],
            added_at=record['added_at'],
            updated_at=record['updated_at']
        )

    async def load_many_milestones(self, recordIds: List = None) -> List[Optional[Milestone]]:
        retVal=[]
        for recordId in recordIds:
            result = requests.get(self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/milestone/"+str(recordId), cookies={"SDSESSION":self.authToken})
            if result.status_code!=200:
                raise Exception(f"HTTP{result.status_code} received")
            record=json.loads(result.text)
            retVal.append(
                Milestone_IE(
                    id=record['id'],
                    patient_hospital_number=record['patient_hospital_number'],
                    milestone_type_id=record['milestone_type_id'],
                    current_state=record['current_state'],
                    added_at=record['added_at'],
                    updated_at=record['updated_at']
                )
            )
        return retVal