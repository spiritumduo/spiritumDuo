import logging
from typing import Optional, List, Any, Union

from trustadapter import TrustAdapter
from sdpubsub import SdPubSub
from trustadapter.trustadapter import (
    Patient_IE, TestResult_IE, TestResultRequest_IE
)
from email_adapter import EmailAdapter
from exchangelib import FileAttachment, HTMLBody


class BaseService:
    def __init__(self):
        self.logger = logging.getLogger(
            f"{__name__}.{self.__class__.__name__}",
        )


class EmailService(BaseService):
    def __init__(self, email_client: EmailAdapter):
        if email_client is None:
            raise Exception("No email client supplied")
        self._email_client = email_client
        super().__init__()

    async def send_email(
        self,
        recipients: List[str] = None,
        subject: str = None,
        body: Union[str, HTMLBody] = None,
        attachments: List[FileAttachment] = None
    ):
        return self._email_client.send_email(
            recipients=recipients,
            subject=subject,
            body=body,
            attachments=attachments
        )


class PubSubService(BaseService):
    def __init__(self, pubsub_client: SdPubSub):
        if pubsub_client is None:
            raise Exception("No PubSub supplied")
        self._pubsub_client = pubsub_client
        super().__init__()

    async def publish(self, topic: str, message: Any):
        await self._pubsub_client.publish(topic=topic, message=message)

    def subscribe(self, topic: str):
        return self._pubsub_client.subscribe(topic=topic)


class TrustAdapterService(BaseService):
    def __init__(self, trust_adapter_client: TrustAdapter = None):
        if trust_adapter_client is None:
            raise Exception("No TrustAdapter supplied")
        self._trust_adapter_client = trust_adapter_client
        super().__init__()

    async def test_connection(self, auth_token: str = None):
        """
        Tests the connection to the trust integration engine
        :return: Boolean success state of connection
        """

    async def create_patient(
        self, patient: Patient_IE, auth_token: str = None
    ):
        """
        Create a patient on the trust
        :param auth_token: Auth token string to pass to backend
        :param patient: Patient to input
        :return: String ID of created patient
        """
        return await self._trust_adapter_client.create_patient(
            patient=patient, auth_token=auth_token)

    async def load_patient(
        self, hospitalNumber: str = None, auth_token: str = None
    ) -> Optional[Patient_IE]:
        """
        Load single patient
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumber: String ID of patient
        :return: Patient if found, null if not
        """
        return await self._trust_adapter_client.load_patient(
            hospitalNumber=hospitalNumber, auth_token=auth_token)

    async def load_many_patients(
        self, hospitalNumbers: List = None, auth_token: str = None
    ) -> List[Optional[Patient_IE]]:
        """
        Load many patients
        :param auth_token: Auth token string to pass to backend
        :param hospitalNumbers: List of patient ids to load
        :return: List of patients, or empty list if none found
        """
        return await self._trust_adapter_client.load_many_patients(
            hospitalNumbers=hospitalNumbers, auth_token=auth_token
        )

    async def create_test_result(
        self, testResult: TestResultRequest_IE = None, auth_token: str = None
    ) -> TestResult_IE:
        """
        Create a test result
        :param auth_token: Auth token string to pass to backend
        :param testResult: Test result to create
        :return: String ID of created test result
        """
        return await self._trust_adapter_client.create_test_result(
            testResult=testResult, auth_token=auth_token)

    async def load_test_result(
        self, recordId: str = None, auth_token: str = None
    ) -> Optional[TestResult_IE]:
        """
        Load a test result
        :param auth_token: Auth token string to pass to backend
        :param recordId: ID of test result to load
        :return: Test result, or null if test result not found
        """
        return await self._trust_adapter_client.load_test_result(
            recordId=recordId, auth_token=auth_token)

    async def load_many_test_results(
        self, recordIds: str = None, auth_token: str = None
    ) -> List[Optional[TestResult_IE]]:
        """
        Load many test results
        :param auth_token: Auth token string to pass to backend
        :param recordIds: IDs of test results to load
        :return: List of test results, or empty list if none found
        """
        return await self._trust_adapter_client.load_many_test_results(
            recordIds=recordIds, auth_token=auth_token)

    async def patient_search(self, query: str) -> List[Patient_IE]:
        """
        Search for patients with given query string
        :param query: free-form text string
        :return: List of patients
        """
        return await self._trust_adapter_client.patient_search(query)

    async def clear_database(self) -> bool:
        """
        Clears pseudotie database
        :return: boolean success
        """
        return await self._trust_adapter_client.clear_database()

    async def create_test_result_immediately(
        self, testResult: TestResultRequest_IE = None, auth_token: str = None
    ) -> TestResult_IE:
        """
        Create a test result
        :param auth_token: Auth token string to pass to backend
        :param testResult: Test result to create
        :return: String ID of created test result
        """
        return await self._trust_adapter_client.create_test_result_immediately(
            testResult=testResult, auth_token=auth_token)
