from api.models.User import User
from datetime import datetime
from dataclasses import dataclass
from typing import Union

@dataclass
class UserDAO:
    id: int
    firstName: str = None
    lastName: str = None
    userName: str = None
    passwordHash: str = None
    department: str = None
    lastAccess: datetime = None
    _orm: User = User()

    @classmethod
    def read(cls, searchParam: Union[int, str]):
        user_orm = None
        if isinstance(searchParam, int):
            user_orm = User.objects.get(id=searchParam)
        elif isinstance(searchParam, str):
            user_orm = User.objects.get(id=searchParam)

        return cls(
            id=user_orm.id,
            firstName=user_orm.firstName,
            lastName=user_orm.lastName,
            userName=user_orm.userName,
            passwordHash=user_orm.passwordHash,
            department=user_orm.department,
            lastAccess=user_orm.lastAccess,
            _orm=user_orm
        )

    def save(self):
        self._orm.id = self.id
        self._orm.firstName = self.firstName
        self._orm.lastName = self.lastName
        self._orm.userName = self.userName
        self._orm.passwordHash = self.passwordHash
        self._orm.department = self.department
        self._orm.lastAccess = self.lastAccess

        self._orm.save()

    def delete(self):
        self._orm.delete()
