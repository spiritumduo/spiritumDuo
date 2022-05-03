from typing import List, Dict, Optional
from aiodataloader import DataLoader
from models import MilestoneType, PathwayMilestoneType
import logging


class MilestoneTypeLoader(DataLoader):
    """
        This is class for loading MilestoneType objects and
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_milestone_type_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    @classmethod
    def _get_loader_from_context(cls, context) -> "MilestoneTypeLoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return context[cls.loader_name]

    async def fetch(self, keys) -> Dict[int, MilestoneType]:
        async with self._db.acquire(reuse=False) as conn:
            query = MilestoneType.query.where(MilestoneType.id.in_(keys))
            result = await conn.all(query)
            logging.info(result)

            returnData = {}
            for milestone in result:
                returnData[milestone.id] = milestone

            return returnData

    async def batch_load_fn(self, keys) -> List[MilestoneType]:
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(
        cls,
        context=None,
        id=None
    ) -> Optional[MilestoneType]:
        """
            Load a single entry from its record ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                MilestoneType/None
        """
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> Optional[List[MilestoneType]]:
        """
            Load a multiple entries from their record IDs

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[MilestoneType]/None
        """
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    async def load_all(cls, context=None):
        """
            Loads all MilestoneType records

            Parameters:
                context (dict): request context
            Returns:
            List[MilestoneType]/None
        """
        milestone_types = await MilestoneType.query.gino.all()
        for t in milestone_types:
            cls._get_loader_from_context(context).prime(t.id, t)
        return milestone_types


class MilestoneTypeLoaderByPathwayId(DataLoader):
    """
        This is class for loading MilestoneType objects and
        caching the result in the request context by pathway ID
        using PathwayMilestoneType link table

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    @classmethod
    async def load_from_id(
        cls,
        context=None,
        id=None
    ) -> Optional[MilestoneType]:
        """
            Loads MilestoneTypes from their associated
            pathway ID from the PathwayMilestoneType link
            table

            Parameters:
                context (dict): request context
                id (int): ID of pathway ID to find
            Returns:
                [MilestoneType]/None
        """
        if not id or not context:
            return None

        _gino = context['db']

        async with _gino.acquire(reuse=False) as conn:
            query = _gino.select([MilestoneType])\
                .select_from(
                    _gino.join(
                        MilestoneType,
                        PathwayMilestoneType,
                        MilestoneType.id == PathwayMilestoneType.milestone_type_id
                    )
                )\
                .where(PathwayMilestoneType.pathway_id == int(id))

            result = await conn.all(query)

            if MilestoneTypeLoader.loader_name not in context:
                context[MilestoneTypeLoader.loader_name] = MilestoneTypeLoader(
                    db=context['db']
                )
            for mT in result:
                context[MilestoneTypeLoader.loader_name].prime(mT.id, mT)

            return result

