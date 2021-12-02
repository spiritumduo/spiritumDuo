from aiodataloader import DataLoader
from models import User
from typing import List

class UserByIdLoader(DataLoader):
    loader_name = "_user_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[User]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=User.query.where(User.id.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.id]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[User]:
        pathwayDict=await self.fetch([int(i) for i in keys])
        sortedPathways=[]
        for key in keys:
            sortedPathways.append(pathwayDict.get(int(key)))
        return sortedPathways

    @classmethod
    async def load_from_id(cls, context=None, id=None):
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        pathway=await context[cls.loader_name].load(id)
        return pathway

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None):
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)