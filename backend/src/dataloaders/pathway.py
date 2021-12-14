from aiodataloader import DataLoader
from models import Pathway
from typing import List, Union

class PathwayByIdLoader(DataLoader):
    loader_name = "_pathway_by_id_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[Pathway]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=Pathway.query.where(Pathway.id.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.id]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[Pathway]:
        pathwayDict=await self.fetch([int(i) for i in keys])
        sortedPathways=[]
        for key in keys:
            sortedPathways.append(pathwayDict.get(int(key)))
        return sortedPathways

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Union[Pathway, None]:
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name]=cls(db=context['db'])
        pathway=await context[cls.loader_name].load(id)

        if pathway:
            if not PathwayByNameLoader.loader_name in context:
                context[PathwayByNameLoader.loader_name]=PathwayByNameLoader(db=context['db'])
            context[PathwayByNameLoader.loader_name].prime(pathway.name, pathway)

        return pathway

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[Pathway], None]:
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    async def load_all(cls)->Union[List[Pathway], None]:
        return await Pathway.query.gino.all()



class PathwayByNameLoader(DataLoader):
    loader_name = "_pathway_by_name_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[Pathway]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=Pathway.query.where(Pathway.name.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.name]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[Pathway]:
        pathwayDict=await self.fetch(keys)
        sortedPathways=[]
        for key in keys:
            sortedPathways.append(pathwayDict.get(key))
        return sortedPathways

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Union[Pathway, None]:
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name]=cls(db=context['db'])
        pathway=await context[cls.loader_name].load(id)

        if pathway is not None:
            if not PathwayByIdLoader.loader_name in context:
                context[PathwayByIdLoader.loader_name]=PathwayByIdLoader(db=context['db'])
            context[PathwayByIdLoader.loader_name].prime(pathway.id, pathway)

        return pathway

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[Pathway], None]:
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)