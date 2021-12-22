from typing import List, Dict, Optional
from aiodataloader import DataLoader
from models import Milestone


class MilestoneByPatientLoader(DataLoader):
    loader_name = "_milestone_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    @classmethod
    def _get_loader_from_context(cls, context) -> "MilestoneByPatientLoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return context[cls.loader_name]

    async def fetch(self, keys) -> Dict[int, Milestone]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = Milestone.query.where(Milestone.patient_id.in_(keys))
            result = await conn.all(query)

        returnData = {}
        for patient_milestone in result:
            returnData[patient_milestone.patient_id] = patient_milestone

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
    def prime_with_context(cls, context=None, id=None, value=None) -> "MilestoneByPatientLoader":
        return cls._get_loader_from_context(context).prime(id, value)
