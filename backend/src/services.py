import logging
from typing import Optional, List

from models import Milestone
from trustadapter import TrustAdapter
from trustadapter.trustadapter import Patient_IE, Milestone_IE


class BaseService:
    def __init__(self):
        self.logger = logging.getLogger(
            f"{__name__}.{self.__class__.__name__}",
        )


class TrustAdapterService(BaseService):
    def __init__(self, trust_adapter_client: TrustAdapter = None):
        if trust_adapter_client is None:
            raise Exception("No TrustAdapter supplied")
        self._trust_adapter_client = trust_adapter_client
        super().__init__()


    async def create_patient(self, patient: Patient_IE = None, auth_token: str = None):
        """
        Create a patient on the trust
        :param auth_token: Auth token string to pass to backend
        :param patient: Patient to input
        :return: String ID of created patient
        """
        return await self._trust_adapter_client.create_patient(patient=patient, auth_token=auth_token)

    async def load_patient(self, hospitalNumber: str = None, auth_token: str = None) -> Optional[Patient_IE]:
        """
        Load single patient
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumber: String ID of patient
        :return: Patient if found, null if not
        """
        return await self._trust_adapter_client.load_patient(hospitalNumber=hospitalNumber, auth_token=auth_token)

    async def load_many_patients(self, hospitalNumbers: List = None, auth_token: str = None) -> List[Optional[Patient_IE]]:
        """
        Load many patients
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumbers: List of patient ids to load
        :return: List of patients, or empty list if none found
        """
        return await self._trust_adapter_client.load_many_patients(
            hospitalNumbers=hospitalNumbers, auth_token=auth_token
        )

    async def create_milestone(self, milestone: Milestone = None, auth_token: str = None) -> Milestone_IE:
        """
        Create a Milestone
        :param auth_token: Auth token string to pass to backend
        :param milestone: Milestone to create
        :return: String ID of created milestone
        """
        return await self._trust_adapter_client.create_milestone(milestone=milestone, auth_token=auth_token)

    async def load_milestone(self, recordId: str = None, auth_token: str = None) -> Optional[Milestone_IE]:
        """
        Load a Milestone
        :param auth_token: Auth token string to pass to backend
        :param recordId: ID of milestone to load
        :return: Milestone, or null if milestone not found
        """
        return await self._trust_adapter_client.load_milestone(recordId=recordId, auth_token=auth_token)

    async def load_many_milestones(self, recordIds: str = None, auth_token: str = None) -> List[Optional[Milestone_IE]]:
        """
        Load many milestones
        :param auth_token: Auth token string to pass to backend
        :param recordIds: IDs of milestones to load
        :return: List of milestones, or empty list if none found
        """
        return await self._trust_adapter_client.load_many_milestones(recordIds=recordIds, auth_token=auth_token)


