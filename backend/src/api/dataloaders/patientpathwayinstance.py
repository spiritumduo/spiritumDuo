from typing import List
from aiodataloader import DataLoader
from api.common import db_sync_to_async
from api.models import PatientPathwayInstance

class PatientPathwayInstanceLoader(DataLoader):
    @db_sync_to_async
    def fetch_data(self, keys)->List[PatientPathwayInstance]:
        return PatientPathwayInstance.objects.in_bulk(id_list=keys)

    async def batch_load_fn(self, keys)->List[PatientPathwayInstance]:
        unsortedEntries=await self.fetch_data(keys)
        sortedEntries=[]
        for key in keys:
            sortedEntries.append(unsortedEntries.get(int(key)))
        return sortedEntries

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        if not ids:
            return None
        loader_name="_patient_pathway_instnc_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        return await context[loader_name].load(ids)