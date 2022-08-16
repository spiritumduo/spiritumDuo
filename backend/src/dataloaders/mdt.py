from aiodataloader import DataLoader
from models import MDT
from typing import List, Union


class MdtByIdLoader(DataLoader):
    """
        This is class for loading MDT objects and
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """
    loader_name = "_mdt_by_id_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[MDT]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = MDT.query.where(MDT.id.in_(keys))
            result: List[MDT] = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[MDT]:
        data = await self.fetch([int(i) for i in keys])
        sorted = []
        for key in keys:
            sorted.append(data.get(int(key)))
        return sorted

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[MDT, None]:
        """
            Load a single entry from its record ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                MDT/None
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
    ) -> Union[List[MDT], None]:
        """
            Loads many entires from their record ID

            Parameters:
                context (dict): request context
                ids (List[int]): IDs to find
            Returns:
                List[User]/None
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
            raise TypeError("key cannot be None value")

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return super(cls, context[cls.loader_name]).prime(key=key, value=value)
