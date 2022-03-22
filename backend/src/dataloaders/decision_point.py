from aiodataloader import DataLoader
from SdTypes import DecisionTypes
from models import DecisionPoint
from typing import List, Union


class DecisionPointLoader(DataLoader):
    """
        This is class for loading decision points and
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_decision_point_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[DecisionPoint]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = DecisionPoint.query.where(DecisionPoint.id.in_(keys))
            result = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row
        return returnData

    async def batch_load_fn(self, keys) -> List[DecisionPoint]:
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(
        cls,
        context=None,
        id: int = None
    ) -> Union[DecisionPoint, None]:
        """
            Load a single entry from its record ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                DecisionPoint/None
        """

        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load(id)

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids: List[int] = None
    ) -> Union[List[DecisionPoint], None]:
        """
            Load a multiple entries from their record IDs

            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns:
                List[DecisionPoint]/None
        """
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)


class DecisionPointsByPatient:
    """
        This is class for loading decision points using
        a patient's ID

        Attributes:
            None
    """

    @staticmethod
    async def load_from_id(
        context=None,
        id: int = None,
        pathwayId: int = None,
        decisionType: DecisionTypes = None,
        limit: Union[int, None] = None
    ) -> Union[List[DecisionPoint], None]:
        """
            Load all decision points by a patient's record ID
            and where filters match

            Parameters:
                context (dict): request context
                id (int): ID of patient's record
                pathwayId (int): ID of pathway to filter by
                decisionType (DecisionTypes): decision type to filter by
                limit (int): number of records to return
            Returns:
                List[DecisionPoint]/None
        """

        if not context or not id:
            return None

        query = DecisionPoint.query.where(
            DecisionPoint.patient == id
        ).order_by(DecisionPoint.added_at.desc())

        if pathwayId is not None:
            query = query.where(
                DecisionPoint.pathway == int(pathwayId)
            )

        if decisionType:
            query = query.where(
                DecisionPoint.decision_type == decisionType
            )

        if limit is not None:
            query = query.limit(int(limit))

        _gino = context['db']
        async with _gino.acquire(reuse=False) as conn:
            decisionPoints = await conn.all(query)
        if DecisionPointLoader.loader_name not in context:
            context[DecisionPointLoader.loader_name] = DecisionPointLoader(
                db=context['db']
            )
        for dP in decisionPoints:
            context[DecisionPointLoader.loader_name].prime(dP.id, dP)
        return decisionPoints


class DecisionPointsByOnPathway:
    """
        This is class for loading decision points using
        an OnPathway id

        Attributes:
            None
    """

    @staticmethod
    async def load_many_from_id(
        context=None,
        id=None
    ) -> Union[List[DecisionPoint], None]:
        """
            Load all decision points by an OnPathway id

            Parameters:
                context (dict): request context
                id (List[int]): IDs of OnPathway records
            Returns:
                List[DecisionPoint]/None
        """

        if not context or not id:
            return None

        query = DecisionPoint.query.where(
            DecisionPoint.on_pathway_id == id
        ).order_by(DecisionPoint.added_at.desc())

        _gino = context['db']
        async with _gino.acquire(reuse=False) as conn:
            decisionPoints = await conn.all(query)
        if DecisionPointLoader.loader_name not in context:
            context[DecisionPointLoader.loader_name] = DecisionPointLoader(
                db=context['db']
            )
        for dP in decisionPoints:
            context[DecisionPointLoader.loader_name].prime(dP.id, dP)
        return decisionPoints
