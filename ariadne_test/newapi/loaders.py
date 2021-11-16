from aiodataloader import DataLoader
from asgiref.sync import sync_to_async
from newapi.models import Cat


class CatsLoader(DataLoader):
    @sync_to_async
    def fetch_cats(self, keys) -> [Cat]:
        cats = Cat.objects.in_bulk(keys)
        return cats

    async def batch_load_fn(self, keys) -> [Cat]:
        catDict = await self.fetch_cats(keys)
        sortedCats = []
        for k in keys:
            sortedCats.append(catDict.get(int(k), None))
        return sortedCats


class MeowLoader(DataLoader):
    async def batch_load_fn(self, keys):
        meows = []
        for k in keys:
            meows.append("meow! " + str(k))
        return meows


def create_loaders():
    return {
        'cats': CatsLoader,
        'meows': MeowLoader,
    }
