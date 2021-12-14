from aiodataloader import DataLoader
from models import User
from typing import List, Union

class UserByIdLoader(DataLoader):
    loader_name = "_user_by_id_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[User]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=User.query.where(User.id.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.id]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[User]:
        userDict=await self.fetch([int(i) for i in keys])
        sortedUsers=[]
        for key in keys:
            sortedUsers.append(userDict.get(int(key)))
        return sortedUsers

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Union[User, None]:
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        user=await context[cls.loader_name].load(id)
        if user:
            if not UserByUsernameLoader.loader_name in context:
                context[UserByUsernameLoader.loader_name]=UserByUsernameLoader(db=context['db'])
            context[UserByUsernameLoader.loader_name].prime(user.username, user)
        return user

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[User], None]:
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

class UserByUsernameLoader(DataLoader):
    loader_name = "_user_by_username_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[User]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=User.query.where(User.username.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.username]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[User]:
        userDict=await self.fetch(keys)
        sortedUsers=[]
        for key in keys:
            sortedUsers.append(userDict.get(key))
        return sortedUsers

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Union[User, None]:
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        user=await context[cls.loader_name].load(id)

        if user:
            if not UserByIdLoader.loader_name in context:
                context[UserByIdLoader.loader_name]=UserByIdLoader(db=context['db'])
            context[UserByIdLoader.loader_name].prime(user.id, user)

        return user

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[User], None]:
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)