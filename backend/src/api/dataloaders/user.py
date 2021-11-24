from typing import List
from aiodataloader import DataLoader
from api.common import database_sync_to_async
from api.models import SdUser

class UserLoader(DataLoader):
    @database_sync_to_async
    def fetch_users(self, keys)->List[SdUser]:
        return SdUser.objects.in_bulk(keys)
    async def batch_load_fn(self, keys)->List[SdUser]:
        listRecords=await self.fetch_users(keys)
        sortedRecords=[]
        for key in keys:
            sortedRecords.append(listRecords.get(int(key), None))
        return sortedRecords

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        loader_name="_user_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        patient=await context[loader_name].load(ids)
        return patient