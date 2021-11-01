from django.db import models
from datetime import datetime
from dataclasses import dataclass

class user_orm(models.Model):
    id=models.AutoField(primary_key=True)
    firstName=models.TextField()
    lastName=models.TextField()
    userName=models.TextField()
    passwordHash=models.TextField()
    department=models.TextField()
    lastAccess=models.DateTimeField()

@dataclass
class UserModel:
    id:str
    firstName:str = None
    lastName:str = None
    userName:str = None
    passwordHash:str = None
    department:str = None
    lastAccess:datetime = None
    _orm: user_orm = user_orm()
    
    @classmethod
    def read(cls, searchParam:int=None):
        try:
            if not searchParam:
                return user_orm.objects.all()
            elif searchParam.isnumeric():
                return user_orm.objects.get(id=searchParam)
        except (user_orm.DoesNotExist):
            return False

    def save(self):
        self._orm.id=self.id
        self._orm.firstName=self.firstName
        self._orm.lastName=self.lastName
        self._orm.userName=self.userName
        self._orm.passwordHash=self.passwordHash
        self._orm.department=self.department
        self._orm.lastAccess=self.lastAccess
        
        self._orm.save()
        
    def delete(self):
        self._orm.delete()
