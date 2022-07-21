from typing import List, Dict, Optional
from aiodataloader import DataLoader
from models import ClinicalRequestType, PathwayClinicalRequestType
import logging


class ClinicalRequestTypeLoader(DataLoader):
    """
        This is class for loading ClinicalRequestType objects and
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_clinical_request_type_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    @classmethod
    def _get_loader_from_context(cls, context) -> "ClinicalRequestTypeLoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return context[cls.loader_name]

    async def fetch(self, keys) -> Dict[int, ClinicalRequestType]:
        async with self._db.acquire(reuse=False) as conn:
            query = ClinicalRequestType.query.where(ClinicalRequestType.id.in_(keys))
            result = await conn.all(query)
            logging.info(result)

            returnData = {}
            for clinical_request in result:
                returnData[clinical_request.id] = clinical_request

            return returnData

    async def batch_load_fn(self, keys) -> List[ClinicalRequestType]:
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
    ) -> Optional[ClinicalRequestType]:
        """
            Load a single entry from its record ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                ClinicalRequestType/None
        """
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> Optional[List[ClinicalRequestType]]:
        """
            Load a multiple entries from their record IDs

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[ClinicalRequestType]/None
        """
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    async def load_all(cls, context=None):
        """
            Loads all ClinicalRequestType records

            Parameters:
                context (dict): request context
            Returns:
            List[ClinicalRequestType]/None
        """
        clinical_request_types = await ClinicalRequestType.query.gino.all()
        for t in clinical_request_types:
            cls._get_loader_from_context(context).prime(t.id, t)
        return clinical_request_types


class ClinicalRequestTypeLoaderByPathwayId(DataLoader):
    """
        This is class for loading ClinicalRequestType objects and
        caching the result in the request context by pathway ID
        using PathwayClinicalRequestType link table

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    @classmethod
    async def load_from_id(
        cls,
        context=None,
        id=None
    ) -> Optional[ClinicalRequestType]:
        """
            Loads ClinicalRequestTypes from their associated
            pathway ID from the PathwayClinicalRequestType link
            table

            Parameters:
                context (dict): request context
                id (int): ID of pathway ID to find
            Returns:
                [ClinicalRequestType]/None
        """
        if not id or not context:
            return None

        _gino = context['db']

        async with _gino.acquire(reuse=False) as conn:
            query = _gino.select([ClinicalRequestType])\
                .select_from(
                    _gino.join(
                        ClinicalRequestType,
                        PathwayClinicalRequestType,
                        ClinicalRequestType.id == PathwayClinicalRequestType.clinical_request_type_id
                    )
                )\
                .where(PathwayClinicalRequestType.pathway_id == int(id))

            result = await conn.all(query)

            if ClinicalRequestTypeLoader.loader_name not in context:
                context[ClinicalRequestTypeLoader.loader_name] = ClinicalRequestTypeLoader(
                    db=context['db']
                )
            for mT in result:
                context[ClinicalRequestTypeLoader.loader_name].prime(mT.id, mT)

            return result

