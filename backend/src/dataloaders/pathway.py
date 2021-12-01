from aiodataloader import DataLoader
from models import Pathway
from typing import List

class PathwayLoader(DataLoader):
    loader_name = "_pathway_loader"

    async def fetch(self, keys)->List[Pathway]:
        _dict={}
        for key in keys:
            _dict[int(key)]=await Pathway.query.where(Pathway.id==int(key)).gino.first()
        return _dict

    async def batch_load_fn(self, keys)->List[Pathway]:
        pathwayDict=await self.fetch(keys)
        sortedPathways=[]
        for key in keys:
            sortedPathways.append(pathwayDict.get(int(key)))
        return sortedPathways

    @classmethod
    async def load_from_id(cls, context=None, id=None):
        if not id:
            return None
        loader_name="_pathway_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        pathway=await context[loader_name].load(id)
        return pathway

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None):
        if cls.loader_name not in context:
            context[cls.loader_name] = cls()
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    async def load_all(cls):
        return await Pathway.query.gino.all()