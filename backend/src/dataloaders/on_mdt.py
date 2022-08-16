from aiodataloader import DataLoader
from models import OnMdt
from typing import List, Union


class OnMdtByIdLoader(DataLoader):
    """
        This is class for loading OnMdt records
        by their IDs

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_on_mdt_by_id_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[OnMdt]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = OnMdt.query.where(OnMdt.id.in_(keys))
            result: List[OnMdt] = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[OnMdt]:
        unsortedDict = await self.fetch([int(i) for i in keys])
        sortedList = []
        for key in keys:
            sortedList.append(unsortedDict.get(int(key)))
        return sortedList

    @classmethod
    async def load_from_id(
        cls, context=None, id=None
    ) -> Union[OnMdt, None]:
        """
            Load a single entry from its record ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                OnMdt/None
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if not id:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load(id)

    @classmethod
    async def load_many_from_id(
        cls, context=None, ids=None
    ) -> Union[List[OnMdt], None]:
        """
            Loads many entries from their record ID

            Parameters:
                context (dict): request context
                ids (List[int]): IDs to find
            Returns:
                List[OnPathway]/None
        """

        if context is None:
            raise TypeError("context cannot be None type")
        if ids is None:
            return []

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    def prime(cls, key=None, value=None, context=None):
        if context is None:
            raise TypeError("context cannot be None type")

        if key is None:
            raise TypeError("key cannot be None type")

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return super(OnMdtByIdLoader, context[cls.loader_name]).prime(
            key=key, value=value
        )
