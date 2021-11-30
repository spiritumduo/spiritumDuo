from typing import List
from aiodataloader import DataLoader
from api.common import db_sync_to_async
from api.models import DecisionPoint

class DecisionPointLoader(DataLoader):
    @db_sync_to_async
    def fetch_decision_points(self, keys)->List[DecisionPoint]:
        decision_points=DecisionPoint.objects.in_bulk(keys)
        return decision_points
    async def batch_load_fn(self, keys)->List[DecisionPoint]:
        data_dict=await self.fetch_decision_points(keys)
        data_sorted=[]
        for key in keys:
            data_sorted.append(data_dict.get(int(key), None))
        return data_sorted

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        loader_name="_dp_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        data=await context[loader_name].load(ids)
        return data