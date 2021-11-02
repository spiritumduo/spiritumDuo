<<<<<<< Updated upstream
from django.db import models
from datetime import datetime
from dataclasses import dataclass
from typing import Union

class role_orm(models.Model):
    id=models.AutoField(primary_key=True)
    name=models.TextField()

@dataclass
class RoleModel:
    id:int
    name:str
    _orm: role_orm = role_orm()
    
    @classmethod
    def read(cls, searchParam:Union[int,str]=None):
        try:
            if not searchParam:
                return role_orm.objects.all()
            elif searchParam.isnumeric():
                return role_orm.objects.get(id=searchParam)
            else:
                return role_orm.objects.get(name=searchParam)
        except (role_orm.DoesNotExist):
            return False

    def save(self):
        self._orm.id=self.id
        self._orm.name=self.name
        
        self._orm.save()
        
    def delete(self):
        self._orm.delete()
=======
# from django.db import models
# from datetime import datetime
# from dataclasses import dataclass
# from typing import Union

# class role_orm(models.Model):
#     name=models.TextField()

# @dataclass
# class RoleModel:
#     id:int
#     name:str
#     _orm: role_orm = role_orm()
    
#     @classmethod
#     def read(cls, searchParam:Union[int,str]=None):
#         try:
#             if not searchParam:
#                 return role_orm.objects.all()
#             elif searchParam.isnumeric():
#                 return role_orm.objects.get(id=searchParam)
#             else:
#                 return role_orm.objects.get(name=searchParam)
#         except (role_orm.DoesNotExist):
#             return False

#     def save(self):
#         self._orm.id=self.id
#         self._orm.name=self.name
        
#         self._orm.save()
        
#     def delete(self):
#         self._orm.delete()
>>>>>>> Stashed changes
