import requests
from models import Milestone, Patient
from abc import ABC, abstractmethod
from typing import List, Optional


class IntegrationEngine(ABC):
    """
    Integration Engine Abstract Base Class

    This class represents the interface SD uses to communicate with a backend hospital system.
    """

    @abstractmethod
    async def load_patient(self, record_id: str = None) -> Optional[Patient]:
        """
        Load single patient
        :param record_id: String ID of patient
        :return: Patient if found, null if not
        """
        pass

    @abstractmethod
    async def load_many_patients(self, record_ids: List = None) -> List[Optional[Patient]]:
        """
        Load many patients
        :param record_ids: List of patient ids to load
        :return: List of patients, or empty list if none found
        """
        pass

    @abstractmethod
    async def create_milestone(self, milestone: Milestone = None) -> str:
        """
        Create a Milestone
        :param milestone: Milestone to create
        :return: String ID of created milestone
        """
        pass

    @abstractmethod
    async def load_milestone(self, record_id: str = None) -> Optional[Milestone]:
        """
        Load a Milestone
        :param record_id: ID of milestone to load
        :return: Milestone, or null if milestone not found
        """
        pass

    @abstractmethod
    async def load_many_milestones(self, record_ids: str = None) -> List[Optional[Milestone]]:
        """
        Load many milestones
        :param record_ids: IDs of milestones to load
        :return: List of milestones, or empty list if none found
        """
        pass


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
        self._authToken = auth_token

    async def load_patient(self, record_id: str = None) -> Optional[Patient]:
        pass

    async def load_many_patients(self, record_ids: List = None) -> List[Optional[Patient]]:
        pass

    async def create_milestone(self, milestone: Milestone = None) -> str:
        pass

    async def load_milestone(self, record_id: str = None) -> Optional[Milestone]:
        pass

    async def load_many_milestones(self, record_ids: str = None) -> List[Optional[Milestone]]:
        pass
