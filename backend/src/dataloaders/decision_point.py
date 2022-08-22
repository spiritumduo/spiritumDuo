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
        cls, context=None, id: int = None
    ) -> Union[DecisionPoint, None]:
        """
            Load a single entry from its record ID

            :param context: request context
            :param id: ID to find

            :return: DecisionPoint/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
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

            :param context: request context
            :param ids: IDs to find

            :return: List[DecisionPoint]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

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
        context=None, id: int = None, pathwayId: int = None,
        decisionType: DecisionTypes = None, limit: Union[int, None] = None
    ) -> Union[List[DecisionPoint], None]:
        """
            Load all decision points by a patient's record ID
            and where filters match

            :param context: request context
            :param id: ID of patient's record
            :param pathwayId: ID of pathway to filter by
            :param decisionType: decision type to filter by
            :param limit: number of records to return

            :return: List[DecisionPoint]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if not id:
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
            decisionPoints: List[DecisionPoint] = await conn.all(query)
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

            :param context: request context
            :param id: IDs of OnPathway records

            :return: List[DecisionPoint]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if not id:
            return None

        query = DecisionPoint.query.where(
            DecisionPoint.on_pathway_id == id
        ).order_by(DecisionPoint.added_at.desc())

        _gino = context['db']
        async with _gino.acquire(reuse=False) as conn:
            decisionPoints: List[DecisionPoint] = await conn.all(query)
        if DecisionPointLoader.loader_name not in context:
            context[DecisionPointLoader.loader_name] = DecisionPointLoader(
                db=context['db']
            )
        for dP in decisionPoints:
            context[DecisionPointLoader.loader_name].prime(dP.id, dP)
        return decisionPoints
