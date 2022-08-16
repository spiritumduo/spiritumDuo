from typing import List, Dict, Optional
from aiodataloader import DataLoader
from trustadapter.trustadapter import TrustAdapter, TestResult_IE
from dependency_injector.wiring import Provide, inject
from containers import SDContainer


class TestResultByReferenceIdFromIELoader(DataLoader):
    """
        This is class for loading test results by their
        reference IDs and caching the result in
        the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """
    loader_name = "_test_result_by_reference_id_from_ie_loader"

    def __init__(self, context=None):
        super().__init__()
        self._context = context

    @inject
    async def fetch(
            self, keys, trust_adapter: TrustAdapter = Provide[
                SDContainer.trust_adapter_service
            ]
    ) -> Dict[int, TestResult_IE]:
        result = await trust_adapter.load_many_test_results(
            recordIds=keys,
            auth_token=self._context['request'].cookies['SDSESSION']
        )
        returnData = {}
        for clinical_request in result:
            returnData[clinical_request.id] = clinical_request
        return returnData

    async def batch_load_fn(self, keys):
        fetchDict = await self.fetch(keys)
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(key))
        return sortedData

    @classmethod
    def _get_loader_from_context(
        cls, context=None
    ) -> "TestResultByReferenceIdFromIELoader":

        if context is None:
            raise TypeError("context cannot be None type")

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(context=context)
        return context[cls.loader_name]

    @classmethod
    async def load_from_id(
        cls, context=None, id=None
    ) -> Optional[TestResult_IE]:
        """
            Load a single entry from its reference ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                TestResult_IE/None
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        return await cls._get_loader_from_context(context).load(int(id))

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> List[Optional[TestResult_IE]]:
        """
            Loads many entries from their reference ID

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[TestResult_IE]/None
        """
        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        return await cls._get_loader_from_context(context).load_many(
            [int(x) for x in ids]
        )
