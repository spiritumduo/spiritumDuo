import asyncio
from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from aiodataloader import DataLoader
from operator import and_
from sqlalchemy import desc
from SdTypes import ClinicalRequestState
from models import ClinicalRequest
from typing import Union


class ClinicalRequestByDecisionPointLoader(DataLoader):
    """
        This is class for loading ClinicalRequest objects using IDs from
        DecisionPoint and caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_clinical_request_by_decision_point_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    @classmethod
    def _get_loader_from_context(
        cls,
        context
    ) -> "ClinicalRequestByDecisionPointLoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return context[cls.loader_name]

    async def fetch(self, keys) -> Dict[int, ClinicalRequest]:
        async with self._db.acquire(reuse=False) as conn:
            query = ClinicalRequest.query.where(
                ClinicalRequest.decision_point_id.in_(keys)
            )
            result: List[ClinicalRequest] = await conn.all(query)

        returnData = {}
        for cR in result:
            returnData[cR.decision_point_id] = cR

        return returnData

    async def batch_load_fn(self, keys):
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(
        cls, context=None, id=None
    ) -> Optional[ClinicalRequest]:
        """
            Load clinical requests from a single DecisionPoint ID

            :param context: request context
            :param id: ID to find

            :return: ClinicalRequest/None

            :raise TypeError: invalid argument type
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(
        cls, context=None, ids=None
    ) -> List[Union[ClinicalRequest, None]]:
        """
            Loads clinical requests from multiple DecisionPoint IDs

            :param context: request context
            :param ids: IDs to find

            :return: List[ClinicalRequest/None]

            :raise TypeError: invalid argument type
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    def prime_with_context(
        cls, context=None, id=None, value=None
    ) -> "ClinicalRequestByDecisionPointLoader":
        """
            Adds a key value pair into the dataloader's cache

            :param context: request context
            :param id: ID of object
            :param value: value to update value of kvp

            :raise TypeError: invalid argument type
        """

        if context is None:
            raise TypeError("context cannot be None type")
        if id is None:
            raise TypeError("id cannot be None type")
        if value is None:
            raise TypeError("value cannot be None type")

        return cls._get_loader_from_context(context).prime(id, value)


class SdDataLoader(DataLoader):

    def __init__(self, db, loader_name):
        super().__init__()
        self._db = db
        self._loader_name = loader_name

    @classmethod
    def _get_loader_from_context(
        cls, loader_name: str, context: dict
    ) -> "SdDataLoader":
        if loader_name not in context:
            context[loader_name] = cls(
                db=context['db'], loader_name=loader_name
            )
        return context[loader_name]

    @classmethod
    async def _load_from_id(
        cls, loader_name: str = None,
        context: dict = None, id: Any = None
    ) -> Optional[Any]:
        """
            Load a single entry from its ID

            :param id: Any hashable value
            :param context: request context dictionary
            :param loader_name: name of loader
            :returns Any

            :raise TypeError: invalid argument type
        """
        if loader_name is None:
            raise TypeError("loader_name cannot be None type")
        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        return await cls._get_loader_from_context(
            loader_name, context).load(id)

    @classmethod
    async def _load_many_from_id(
        cls, loader_name: str = None,
        context: dict = None, ids: Any = None
    ) -> List:
        """
            Loads multiple entries from their IDs

            :param loader_name: Name of loader
            :param context: request context
            :param ids: IDs to find

            :return: List of items found

            :raise TypeError: invalid argument type
        """
        if loader_name is None:
            raise TypeError("loader_name cannot be None type")
        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        return await cls._get_loader_from_context(
            loader_name, context).load_many(ids)


class ClinicalRequestByOnPathwayIdLoader(SdDataLoader):
    """
        This is class for loading clinical_requests and
        caching the result in the request context
    """
    loader_name = "_clinical_request_by_on_pathway_loader"

    @dataclass(frozen=True, eq=True)
    class ClinicalRequestByOnPathwayKey:
        id: int
        outstanding: bool
        limit: int

    async def fetch(
        self, key: ClinicalRequestByOnPathwayKey
    ) -> Dict[ClinicalRequestByOnPathwayKey, List[ClinicalRequest]]:

        async with self._db.acquire(reuse=False) as conn:
            query = ClinicalRequest.query.where(
                ClinicalRequest.on_pathway_id == key.id)

            if key.outstanding:
                query = query.where(and_(
                    ClinicalRequest.fwd_decision_point_id.is_(None),
                    ClinicalRequest.current_state ==
                    ClinicalRequestState.COMPLETED
                ))
            if key.limit != 0:
                query = query.order_by(
                    desc(ClinicalRequest.updated_at)).limit(key.limit)
            return await conn.all(query)

    async def batch_load_fn(
        self, keys: List[ClinicalRequestByOnPathwayKey]
    ) -> List[List[ClinicalRequest]]:
        # So this currently queries in a loop, which is very bad.
        # However, this could be batched into two loads - those
        # outstanding, and those not, and then filtering.
        # In case of a limit flag, those might be the greatest-N per
        # group problem? So there could be a solution involving grouping
        # and limiting by ID.

        results = await asyncio.gather(*[self.fetch(k) for k in keys])
        return list(map(
            lambda r: r if not isinstance(r, Exception) else None,
            results
        ))

    @classmethod
    async def load_from_id(
            cls, context=None, id: int = None,
            outstanding: bool = False, limit: int = None
    ) -> List[ClinicalRequest]:
        """
            Load a multiple entries from their record ID

            :param context:: request context
            :param id: IDs to find

            :return: List[ClinicalRequest]

            :raise TypeError: invalid argument type
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return []

        key = cls.ClinicalRequestByOnPathwayKey(
            id=id, outstanding=outstanding, limit=limit
        )
        return await cls._get_loader_from_context(
            cls.loader_name, context).load(key)


class ClinicalRequestByIdLoader(SdDataLoader):
    """
        This is class for loading ClinicalRequests and
        caching the result in the request context
    """

    loader_name = "_clinical_request_by_id_loader"

    async def fetch(self, keys: List[int]) -> Dict[int, List[ClinicalRequest]]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = ClinicalRequest.query.where(ClinicalRequest.id.in_(keys))
            result: List[ClinicalRequest] = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row
        return returnData

    async def batch_load_fn(
        self, keys: List[int]
    ) -> List[List[ClinicalRequest]]:
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(
            cls, context=None, id: int = None
    ) -> Union[ClinicalRequest, None]:
        """
            Load an entry from their record ID

            :param context: request context
            :param id: IDs to find

            :return: ClinicalRequest/None

            :raise TypeError: invalid argument type
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        return await cls._get_loader_from_context(
            cls.loader_name, context).load(id)
