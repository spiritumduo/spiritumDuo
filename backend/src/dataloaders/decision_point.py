from os import path
from aiodataloader import DataLoader
from models import DecisionPoint
from typing import List, Union

class DecisionPointLoader(DataLoader):
    loader_name = "_decision_point_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[DecisionPoint]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=DecisionPoint.query.where(DecisionPoint.id.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.id]=row
        return returnData

    async def batch_load_fn(self, keys)->List[DecisionPoint]:
        fetchDict=await self.fetch([int(i) for i in keys])
        sortedData=[]
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Union[DecisionPoint, None]:
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name]=cls(db=context['db'])
        return await context[cls.loader_name].load(id)

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[DecisionPoint], None]:
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

class DecisionPointsByPatient:
    @staticmethod
    async def load_from_id(context=None, id=None, pathwayId=None, decisionType=None, limit=None)->Union[List[DecisionPoint], None]:
        if not context or not id:
            return None

        query=DecisionPoint.query.where(DecisionPoint.patient==id).order_by(DecisionPoint.added_at.desc())
        if pathwayId is not None:
            query=query.where(DecisionPoint.pathway==int(pathwayId))
        if decisionType:
            query=query.where(DecisionPoint.decision_type==decisionType)
        if limit is not None:
            query=query.limit(int(limit))

        _gino=context['db']
        async with _gino.acquire(reuse=False) as conn:
            decisionPoints=await conn.all(query)
        if DecisionPointLoader.loader_name not in context:
            context[DecisionPointLoader.loader_name]=DecisionPointLoader(db=context['db'])
        for dP in decisionPoints:
            context[DecisionPointLoader.loader_name].prime(dP.id, dP)
        return decisionPoints