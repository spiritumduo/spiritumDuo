from typing import Iterable, Union
from api.models.Role import role_orm

class RoleDAO:
    def __init__(self, id:int=None, name:str=None):
        self.id=id
        self.name=name
        self._orm: role_orm = role_orm()
        if id:
            self._orm.id=id
            self._orm.name=name
    
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
                        cls(
                            id=row.id,
                            name=row.name,
                        )
                    )
                return returnList
            else:
                return cls(
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
        self.id=self._orm.id