from typing import List, Dict, Optional
from aiodataloader import DataLoader
from trustadapter.trustadapter import TrustAdapter, TestResult_IE
from dependency_injector.wiring import Provide, inject
from containers import SDContainer

class TestResultByReferenceIdFromIELoader(DataLoader):
    loader_name = "_test_result_by_reference_id_from_ie_loader"

    def __init__(self, context=None):
        super().__init__()
        self._context=context

    @inject
    async def fetch(
            self, keys, trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
    ) -> Dict[int, TestResult_IE]:
        result = await trust_adapter.load_many_test_results(
            recordIds=keys,
            auth_token=self._context['request'].cookies['SDSESSION']
        )
        returnData = {}
        for milestone in result:
            returnData[milestone.id] = milestone
        return returnData

    async def batch_load_fn(self, keys):
        fetchDict = await self.fetch(keys)
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(key))
        return sortedData

    @classmethod
    def _get_loader_from_context(cls, context) -> "TestResultByReferenceIdFromIELoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(context=context)
        return context[cls.loader_name]

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Optional[TestResult_IE]:
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(int(id))

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->List[Optional[TestResult_IE]]:
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many([int(x) for x in ids])
