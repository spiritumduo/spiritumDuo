from aiodataloader import DataLoader
from models import Pathway, PathwayClinicalRequestType
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
            result: List[Pathway] = await conn.all(query)
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

            :param context: request context
            :param id: ID to find

            :return: Pathway/None

            :raise TypeError:
        """
        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        pathway: Union[Pathway, None] = await context[cls.loader_name].load(id)

        if pathway is not None:
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
        cls, context=None, ids=None
    ) -> Union[List[Pathway], None]:
        """
            Loads many entries from their record IDs

            :param context: request context
            :param ids: IDs to find

            :return: List[Pathway]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    async def load_all(cls, context) -> Union[List[Pathway], None]:
        """
            Loads all Pathway records

            return: List[Pathway]
        """

        if context is None:
            raise TypeError("context cannot be None type")

        db = context['db']
        result = None
        async with db.acquire(reuse=False) as conn:
            result: List[Pathway] = await conn.all(Pathway.query)

        return result


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
            result: List[Pathway] = await conn.all(query)
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

            :param context: request context
            :param id: name to find
            
            :return: Pathway/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        pathway: Union[Pathway, None] = await context[cls.loader_name].load(id)

        if pathway is not None:
            if PathwayByIdLoader.loader_name not in context:
                context[PathwayByIdLoader.loader_name] = PathwayByIdLoader(
                    db=context['db']
                )
            context[PathwayByIdLoader.loader_name].prime(pathway.id, pathway)

        return pathway

    @classmethod
    async def load_many_from_id(
        cls, context=None, ids=None
    ) -> Union[List[Pathway], None]:
        """
            Loads many entries from their names

            :param context: request context
            :param ids: names to find

            :return: List[Pathway]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)


class PathwayLoaderByClinicalRequestType(DataLoader):
    """
        This is class for loading Pathway objects and
        caching the result in the request context by clinical_request type ID
        using PathwayClinicalRequestType link table

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    @classmethod
    async def load_from_id(
        cls, context=None, id=None
    ) -> Union[Pathway, None]:
        """
            Loads ClinicalRequestTypes from their associated
            pathway ID from the PathwayClinicalRequestType link
            table

            :param context: request context
            :param id: ID of pathway ID to find

            :return: [Pathway]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        _gino = context['db']

        async with _gino.acquire(reuse=False) as conn:
            query = _gino.select([Pathway])\
                .select_from(
                    _gino.join(
                        Pathway,
                        PathwayClinicalRequestType,
                        Pathway.id == PathwayClinicalRequestType.pathway_id
                    )
                )\
                .where(
                    PathwayClinicalRequestType.clinical_request_type_id ==
                    int(id)
                )

            result: List[Pathway] = await conn.all(query)

            if PathwayByIdLoader.loader_name not in context:
                context[PathwayByIdLoader.loader_name] = PathwayByIdLoader(
                    db=context['db']
                )
            for pW in result:
                context[PathwayByIdLoader.loader_name].prime(pW.id, pW)

            return result
