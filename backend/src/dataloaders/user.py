from aiodataloader import DataLoader
from models import User
from typing import List, Union


class UserByIdLoader(DataLoader):
    """
        This is class for loading users and
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """
    loader_name = "_user_by_id_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[User]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = User.query.where(User.id.in_(keys))
            result: List[User] = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[User]:
        userDict = await self.fetch([int(i) for i in keys])
        sortedUsers = []
        for key in keys:
            sortedUsers.append(userDict.get(int(key)))
        return sortedUsers

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[User, None]:
        """
            Load a single entry from its record ID

            :param context: request context
            :param id: ID to find
            :return: User/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])

        user: Union[User, None] = await context[cls.loader_name].load(id)

        if user is not None:
            if UserByUsernameLoader.loader_name not in context:
                context[UserByUsernameLoader.loader_name] = \
                    UserByUsernameLoader(db=context['db'])
            context[UserByUsernameLoader.loader_name].prime(
                user.username,
                user
            )

        return user

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> Union[List[User], None]:
        """
            Loads many entires from their record ID

            :param context: request context
            :param id: ID to find

            :return: List[User]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return None

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
        return super(cls, context[cls.loader_name]).prime(key=key, value=value)


class UserByUsernameLoader(DataLoader):
    """
        This is class for loading users by their username
        and caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_user_by_username_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[User]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = User.query.where(User.username.in_(keys))
            result: List[User] = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.username] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[User]:
        userDict = await self.fetch(keys)
        sortedUsers = []
        for key in keys:
            sortedUsers.append(userDict.get(key))
        return sortedUsers

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[User, None]:
        """
            Load a single entry from its username

            :param context: request context
            :param id: username to find

            :return: User/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        user = await context[cls.loader_name].load(id)

        if user:
            if UserByIdLoader.loader_name not in context:
                context[UserByIdLoader.loader_name] = UserByIdLoader(
                    db=context['db']
                )
            context[UserByIdLoader.loader_name].prime(user.id, user, context)

        return user

    @classmethod
    async def load_many_from_id(
        cls, context=None, ids=None
    ) -> Union[List[User], None]:
        """
            Loads many entries from their usernames

            :param context: request context
            :param ids: username to find

            :return: List[User]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)
