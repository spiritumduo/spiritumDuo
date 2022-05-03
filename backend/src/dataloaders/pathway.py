from aiodataloader import DataLoader
from models import Pathway, PathwayMilestoneType
from typing import List, Union


class PathwayByIdLoader(DataLoader):
    """
        This is class for loading Pathways and
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """
    loader_name = "_pathway_by_id_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[Pathway]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = Pathway.query.where(Pathway.id.in_(keys))
            result = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[Pathway]:
        pathwayDict = await self.fetch([int(i) for i in keys])
        sortedPathways = []
        for key in keys:
            sortedPathways.append(pathwayDict.get(int(key)))
        return sortedPathways

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[Pathway, None]:
        """
            Load a single entry from its record ID

            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns:
                Pathway/None
        """
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        pathway = await context[cls.loader_name].load(id)

        if pathway:
            if PathwayByNameLoader.loader_name not in context:
                context[PathwayByNameLoader.loader_name] = PathwayByNameLoader(
                    db=context['db']
                )
            context[PathwayByNameLoader.loader_name].prime(
                pathway.name,
                pathway
            )

        return pathway

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> Union[List[Pathway], None]:
        """
            Loads many entries from their record IDs

            Parameters:
                context (dict): request context
                ids (List[int]): IDs to find
            Returns:
                List[Pathway]/None
        """

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    async def load_all(cls) -> Union[List[Pathway], None]:
        """
            Loads all Pathway records

            Parameters:
                None
            Returns:
                List[Pathway]/None
        """
        return await Pathway.query.gino.all()


class PathwayByNameLoader(DataLoader):
    """
        This is class for loading Pathways by their
        name and caching the result in the request
        context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_pathway_by_name_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[Pathway]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = Pathway.query.where(Pathway.name.in_(keys))
            result = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.name] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[Pathway]:
        pathwayDict = await self.fetch(keys)
        sortedPathways = []
        for key in keys:
            sortedPathways.append(pathwayDict.get(key))
        return sortedPathways

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[Pathway, None]:
        """
            Load a single entry from its name

            Parameters:
                context (dict): request context
                id (str): name to find
            Returns:
                Pathway/None
        """

        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        pathway = await context[cls.loader_name].load(id)

        if pathway is not None:
            if PathwayByIdLoader.loader_name not in context:
                context[PathwayByIdLoader.loader_name] = PathwayByIdLoader(
                    db=context['db']
                )
            context[PathwayByIdLoader.loader_name].prime(pathway.id, pathway)

        return pathway

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> Union[List[Pathway], None]:
        """
            Loads many entries from their names

            Parameters:
                context (dict): request context
                ids (List[str]): names to find
            Returns:
                List[Pathway]/None
        """

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)


class PathwayLoaderByMilestoneType(DataLoader):
    """
        This is class for loading Pathway objects and
        caching the result in the request context by milestone type ID
        using PathwayMilestoneType link table

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    @classmethod
    async def load_from_id(
        cls,
        context=None,
        id=None
    ) -> Union[Pathway, None]:
        """
            Loads MilestoneTypes from their associated
            pathway ID from the PathwayMilestoneType link
            table

            Parameters:
                context (dict): request context
                id (int): ID of pathway ID to find
            Returns:
                [Pathway]/None
        """
        if not id or not context:
            return None

        _gino = context['db']

        async with _gino.acquire(reuse=False) as conn:
            query = _gino.select([Pathway])\
                .select_from(
                    _gino.join(
                        Pathway,
                        PathwayMilestoneType,
                        Pathway.id == PathwayMilestoneType.pathway_id
                    )
                )\
                .where(PathwayMilestoneType.milestone_type_id == int(id))

            result = await conn.all(query)

            if PathwayByIdLoader.loader_name not in context:
                context[PathwayByIdLoader.loader_name] = PathwayByIdLoader(
                    db=context['db']
                )
            for pW in result:
                context[PathwayByIdLoader.loader_name].prime(pW.id, pW)

            return result

