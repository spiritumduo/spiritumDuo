from datetime import datetime
from typing import List, Dict, Optional
from aiodataloader import DataLoader
from models import Milestone
from trustadapter import TrustAdapter
from dependency_injector.wiring import Provide, inject
from containers import SDContainer

class MilestoneByDecisionPointLoader(DataLoader):
    loader_name = "_milestone_by_decision_point_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    @classmethod
    def _get_loader_from_context(cls, context) -> "MilestoneByDecisionPointLoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return context[cls.loader_name]

    async def fetch(self, keys) -> Dict[int, Milestone]:
        async with self._db.acquire(reuse=False) as conn:
            query = Milestone.query.where(Milestone.decision_point_id.in_(keys))
            result = await conn.all(query)

        returnData = {}
        for patient_milestone in result:
            returnData[patient_milestone.decision_point_id] = patient_milestone

        return returnData

    async def batch_load_fn(self, keys):
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Optional[Milestone]:
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None) -> Optional[List[Milestone]]:
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    def prime_with_context(cls, context=None, id=None, value=None) -> "MilestoneByDecisionPointLoader":
        return cls._get_loader_from_context(context).prime(id, value)


class ReferenceMilestone:
    id:str=None
    patient_hospital_number:str=None
    milestone_reference:str=None
    current_state:str=None
    added_at:datetime=None
    updated_at:datetime=None

class MilestoneByReferenceIdFromIELoader(DataLoader):
    loader_name = "_milestone_by_reference_id_from_ie_loader"

    def __init__(self, context=None):
        super().__init__()
        self._context=context

    @inject
    async def fetch(
            self, keys, trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
    ) -> Dict[int, ReferenceMilestone]:
        result = await trust_adapter.load_many_milestones(
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
    def _get_loader_from_context(cls, context) -> "MilestoneByReferenceIdFromIELoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(context=context)
        return context[cls.loader_name]

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Optional[ReferenceMilestone]:
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->List[Optional[ReferenceMilestone]]:
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)
