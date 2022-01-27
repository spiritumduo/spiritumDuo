import dataclasses
import logging

import requests
import httpx
import json
from models import Milestone, Patient, DecisionPoint, OnPathway
from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from datetime import date, datetime
from config import config
from dataclasses import dataclass


@dataclass
class Patient_IE:
    id: int = None,
    first_name: str = None,
    last_name: str = None,
    hospital_number: str = None,
    national_number: str = None,
    communication_method: str = None,
    date_of_birth: date = None

class Milestone_IE:
    def __init__(self, 
        id:int=None,
        current_state:str=None, 
        added_at:date=None, 
        updated_at:date=None
    ):
        self.id=id
        self.current_state=current_state
        self.added_at=added_at
        self.updated_at=updated_at
       


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

    async def load_many_patients(self, hospitalNumbers:List=None, auth_token: str = None) -> List[Optional[Patient_IE]]:
        """
        Load many patients
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumbers: List of patient ids to load
        :return: List of patients, or empty list if none found
        """

    @abstractmethod
    async def create_milestone(self, milestone: Milestone = None, auth_token: str = None) -> Milestone_IE:
        """
        Create a Milestone
        :param auth_token: Auth token string to pass to backend
        :param milestone: Milestone to create
        :return: String ID of created milestone
        """

    @abstractmethod
    async def load_milestone(self, recordId: str = None, auth_token: str = None) -> Optional[Milestone_IE]:
        """
        Load a Milestone
        :param auth_token: Auth token string to pass to backend
        :param recordId: ID of milestone to load
        :return: Milestone, or null if milestone not found
        """

    @abstractmethod
    async def load_many_milestones(self, recordIds: str = None, auth_token: str = None) -> List[Optional[Milestone_IE]]:
        """
        Load many milestones
        :param auth_token: Auth token string to pass to backend
        :param recordIds: IDs of milestones to load
        :return: List of milestones, or empty list if none found
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
        retVal=[]
        for hospNo in hospitalNumbers:
            result = requests.get(
                self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/patient/hospital/"+hospNo,
                cookies={"SDSESSION": auth_token}
            )
            if result.status_code!=200:
                raise Exception(f"HTTP{result.status_code} received")
            record=json.loads(result.text)
            if record is not None:
                retVal.append(
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
        return retVal

    async def create_milestone(self, milestone: Milestone = None, auth_token: str = None) -> Milestone_IE:
        params={}
        if milestone.current_state:
            params['currentState'] = milestone.current_state
        if milestone.added_at:
            params['addedAt'] = milestone.added_at
        if milestone.updated_at:
            params['updatedAt'] = milestone.updated_at

        result = requests.post(
            self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/milestone",
            params=params,
            cookies={"SDSESSION": auth_token}
        )

        tie_milestone=json.loads(result.text)
        try:
            _added_at=datetime.strptime(tie_milestone['added_at'], "%Y-%m-%dT%H:%M:%S")
            _updated_at=datetime.strptime(tie_milestone['updated_at'], "%Y-%m-%dT%H:%M:%S")
        except ValueError:
            _added_at=datetime.strptime(tie_milestone['added_at'], "%Y-%m-%dT%H:%M:%S.%f")
            _updated_at=datetime.strptime(tie_milestone['updated_at'], "%Y-%m-%dT%H:%M:%S.%f")
        
        return Milestone_IE(
            id=tie_milestone['id'],
            current_state=tie_milestone['current_state'],
            added_at=_added_at,
            updated_at=_updated_at
        )

    async def load_milestone(self, recordId: str = None, auth_token: str = None) -> Optional[Milestone_IE]:
        result = requests.get(
            self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/milestone/"+str(recordId),
            cookies={"SDSESSION": auth_token}
        )
        if result.status_code!=200:
            raise Exception(f"HTTP{result.status_code} received")
        record=json.loads(result.text)

        try:
            _added_at=datetime.strptime(record['added_at'], "%Y-%m-%dT%H:%M:%S")
            _updated_at=datetime.strptime(record['updated_at'], "%Y-%m-%dT%H:%M:%S")
        except ValueError:
            _added_at=datetime.strptime(record['added_at'], "%Y-%m-%dT%H:%M:%S.%f")
            _updated_at=datetime.strptime(record['updated_at'], "%Y-%m-%dT%H:%M:%S.%f")
        
        return Milestone_IE(
            id=record['id'],
            current_state=record['current_state'],
            added_at=_added_at,
            updated_at=_updated_at
        )

    async def load_many_milestones(self, recordIds: List = None, auth_token: str = None) -> List[Optional[Milestone_IE]]:
        retVal=[]
        for recordId in recordIds:
            result = requests.get(
                self.TRUST_INTEGRATION_ENGINE_ENDPOINT+"/milestone/"+str(recordId),
                cookies={"SDSESSION": auth_token}
            )
            if result.status_code!=200:
                raise Exception(f"HTTP{result.status_code} received")
            record=json.loads(result.text)
            try:
                _added_at=datetime.strptime(record['added_at'], "%Y-%m-%dT%H:%M:%S")
                _updated_at=datetime.strptime(record['updated_at'], "%Y-%m-%dT%H:%M:%S")
            except ValueError:
                _added_at=datetime.strptime(record['added_at'], "%Y-%m-%dT%H:%M:%S.%f")
                _updated_at=datetime.strptime(record['updated_at'], "%Y-%m-%dT%H:%M:%S.%f")
            retVal.append(
                Milestone_IE(
                    id=record['id'],
                    current_state=record['current_state'],
                    added_at=_added_at,
                    updated_at=_updated_at
                )
            )
        return retVal

