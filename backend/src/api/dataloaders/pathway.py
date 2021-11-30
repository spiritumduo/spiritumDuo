from typing import List
from aiodataloader import DataLoader
from api.common import db_sync_to_async
from api.models import Pathway

class PathwayLoader(DataLoader):
    @db_sync_to_async
    def fetch_patients(self, keys=None)->List[Pathway]:
        records=Pathway.objects.in_bulk(keys)
        return records
    async def batch_load_fn(self, keys=None)->List[Pathway]:
        records=await self.fetch_patients(keys)
        sortedRecords=[]
        for key in keys:
            sortedRecords.append(records.get(int(key), None))
        return sortedRecords

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        loader_name="_pathway_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        pathway=await context[loader_name].load(ids)
        return pathway
    
    @classmethod
    @db_sync_to_async
    def load_all(cls):
        return list(Pathway.objects.all())