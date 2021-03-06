import asyncio
from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from aiodataloader import DataLoader
from operator import and_

from sqlalchemy import desc

from SdTypes import ClinicalRequestState
from models import ClinicalRequest
from typing import Union
from abc import abstractmethod


class ClinicalRequestByDecisionPointLoader(DataLoader):
    """
        This is class for loading clinical_requests using IDs from
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
            result = await conn.all(query)

        returnData = {}
        for patient_clinical_request in result:
            returnData[patient_clinical_request.decision_point_id] = patient_clinical_request

        return returnData

    async def batch_load_fn(self, keys):
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Optional[ClinicalRequest]:
        """
            Load a single entry from its DecisionPoint ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                ClinicalRequest/None
        """
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> Optional[List[ClinicalRequest]]:
        """
            Loads multiple entries from their DecisionPoint IDs

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[ClinicalRequest]/None
        """
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    def prime_with_context(
        cls,
        context=None,
        id=None,
        value=None
    ) -> "ClinicalRequestByDecisionPointLoader":
        return cls._get_loader_from_context(context).prime(id, value)


class SdDataLoader(DataLoader):

    def __init__(self, db, loader_name):
        super().__init__()
        self._db = db
        self._loader_name = loader_name

    @classmethod
    def _get_loader_from_context(cls, loader_name: str, context: dict) -> "SdDataLoader":
        if loader_name not in context:
            context[loader_name] = cls(db=context['db'], loader_name=loader_name)
        return context[loader_name]

    @classmethod
    async def _load_from_id(cls, loader_name: str = None, context: dict = None, id: Any = None) -> Optional[Any]:
        """
            Load a single entry from its ID

            :param id: Any hashable value
            :param context: request context dictionary
            :param loader_name: name of loader
            :returns Any

        """
        if not id:
            return None
        return await cls._get_loader_from_context(loader_name, context).load(id)

    @classmethod
    async def _load_many_from_id(cls, loader_name: str = None, context: dict = None, ids: Any = None) -> List:
        """
            Loads multiple entries from their IDs

            :param loader_name: Name of loader
            :param context: request context
            :param ids: IDs to find
            :return List of items found

        """
        if not ids:
            return []
        return await cls._get_loader_from_context(loader_name, context).load_many(ids)


class ClinicalRequestByOnPathwayIdLoader(SdDataLoader):
    """
        This is class for loading clinical_requests and
        caching the result in the request context
    """
    @dataclass(frozen=True, eq=True)
    class ClinicalRequestByOnPathwayKey:
        id: int
        outstanding: bool
        limit: int

    loader_name = "_clinical_request_by_on_pathway_loader"

    async def fetch(self, key: ClinicalRequestByOnPathwayKey) -> Dict[ClinicalRequestByOnPathwayKey, List[ClinicalRequest]]:
        async with self._db.acquire(reuse=False) as conn:
            query = ClinicalRequest.query.where(ClinicalRequest.on_pathway_id == key.id)
            if key.outstanding:
                query = query.where(and_(
                    ClinicalRequest.fwd_decision_point_id.is_(None), ClinicalRequest.current_state == ClinicalRequestState.COMPLETED
                ))
            if key.limit != 0:
                query = query.order_by(desc(ClinicalRequest.updated_at)).limit(key.limit)
            return await conn.all(query)

    async def batch_load_fn(self, keys: List[ClinicalRequestByOnPathwayKey]) -> List[List[ClinicalRequest]]:
        # So this currently queries in a loop, which is very bad. However, this could be batched into two loads - those
        # outstanding, and those not, and then filtering. In case of a limit flag, those might be the greatest-N per
        # group problem? So there could be a solution involving grouping and limiting by ID.
        results = await asyncio.gather(*[self.fetch(k) for k in keys])
        return list(map(lambda r: r if not isinstance(r, Exception) else None, results))

    @classmethod
    async def load_from_id(
            cls, context=None, id: int = None, outstanding: bool = False, limit: int = None
    ) -> List[ClinicalRequest]:
        """
            Load a multiple entries from their record ID

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[ClinicalRequest]
        """

        key = cls.ClinicalRequestByOnPathwayKey(
            id=id, outstanding=outstanding, limit=limit
        )
        return await cls._get_loader_from_context(cls.loader_name, context).load(key)


class ClinicalRequestByIdLoader(SdDataLoader):
    """
        This is class for loading clinical_requests and
        caching the result in the request context
    """

    loader_name = "_clinical_request_by_id_loader"

    async def fetch(self, keys: List[int]) -> Dict[int, List[ClinicalRequest]]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = ClinicalRequest.query.where(ClinicalRequest.id.in_(keys))
            result = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row
        return returnData
    
    async def batch_load_fn(self, keys: List[int]) -> List[List[ClinicalRequest]]:
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(
            cls, context=None, id: int = None
    ) -> List[ClinicalRequest]:
        """
            Load a multiple entries from their record ID

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[ClinicalRequest]
        """

        return await cls._get_loader_from_context(
            cls.loader_name, context).load(id)
