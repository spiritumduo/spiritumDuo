from typing import Iterable, Union
from api.models.Role import role_orm

class _interface:
    def __init__(self, id:int, name:str):
        self.id=id,
        self.name=name

class RoleDAO:
    def __init__(self, name:str):
        self.name=name
        self._orm: role_orm = role_orm()
    
    @classmethod
    def read(cls, searchParam:Union[int,str]=None):
        try:
            if not searchParam:
                returnData=role_orm.objects.all()
            elif searchParam.isnumeric():
                returnData=role_orm.objects.get(id=searchParam)
            else:
                returnData=role_orm.objects.get(name=searchParam)
            if isinstance(returnData, Iterable):
                returnList=[]
                for row in returnData:
                    returnList.append(
                        _interface(
                            id=row.id,
                            name=row.name,
                        )
                    )
                return returnList
            else:
                return _interface(
                    id=returnData.id,
                    name=returnData.name,
                )

        except (role_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.name=self.name
        self._orm.save()
        return _interface(
            id=self._orm.id,
            name=self._orm.name,
        )