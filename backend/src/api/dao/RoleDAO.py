from typing import Iterable, Union
from api.models.Role import Role

class RoleDAO:
    def __init__(self, id:int=None, name:str=None):
        self.id=id
        self.name=name
        self._orm: Role = Role()
        if id:
            self._orm.id=id
            self._orm.name=name
    
    @classmethod
    def read(cls, id:int=None, name:str=None):
        try:
            if id:
                returnData=Role.objects.get(id=id)
            elif name:
                returnData=Role.objects.get(name=name)
            else:
                returnData=Role.objects.all()

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

        except (Role.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.name=self.name
        self._orm.save()
        self.id=self._orm.id