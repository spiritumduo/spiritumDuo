from typing import Iterable
from api.models.Pathway import pathway_orm

class PathwayDAO:
    def __init__(self, id:int=None, name:str=None):
        self.id=id
        self.name=name
        self._orm: pathway_orm = pathway_orm()
        if id:
            self._orm.id=id
            self._orm.name=name
    
    @classmethod
    def read(cls, id:int=None, name:str=None, dataOnly:bool=False):
        try:
            if id:
                returnData=pathway_orm.objects.get(id=id)
            elif name:
                returnData=pathway_orm.objects.get(name=name)
            else:
                returnData=pathway_orm.objects.all()

            if dataOnly and not isinstance(returnData, Iterable):
                return returnData

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

        except (pathway_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.name=self.name
        self._orm.save()
        self.id=self._orm.id