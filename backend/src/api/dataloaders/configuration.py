from typing import List
from aiodataloader import DataLoader
from asgiref.sync import sync_to_async
from api.models import Configuration

class ConfigurationLoader(DataLoader):
    @sync_to_async
    def fetch_configurations(self, keys)->List[Configuration]:
        configurations=Configuration.objects.in_bulk(keys)
        return configurations
    async def batch_load_fn(self, keys)->List[Configuration]:
        configurationDict=await self.fetch_configurations(keys)
        sortedconfigurations=[]
        for key in keys:
            sortedconfigurations.append(configurationDict.get(int(key), None))
        return sortedconfigurations

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        loader_name="_configuration_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        configuration=await context[loader_name].load(ids)
        return configuration