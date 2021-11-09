from datetime import datetime
from typing import Iterable

from api.models.TestResult import testresult_orm

# Interface between database and GraphQL
class _interface:
    def __init__(self, id:int, patient:int, addedAt:datetime, description:str, mediaUrls:str):
        self.id=id
        self.patient=patient
        self.addedAt=addedAt
        self.description=description
        self.mediaUrls=mediaUrls

# DAO object
class TestResultDAO:
    def __init__(self, id:int=None, patient:int=None, addedAt:datetime=None, description:str=None, mediaUrls:str=None):
        self.id=id
        self.patient=patient
        self.addedAt=addedAt
        self.description=description
        self.mediaUrls=mediaUrls
        self._orm: testresult_orm = None

        if not self._orm:
            self._orm = testresult_orm()

        if self.id:
            self._orm.id=self.id

        self._orm.patient=self.patient
        self._orm.added_at=self.addedAt
        self._orm.description=self.description
        self._orm.media_urls=self.mediaUrls
        self._orm.save()
        self.id=self._orm.id
    
    @classmethod
    def read(cls, id:int=None):
        try:
            if not id:
                returnData=testresult_orm.objects.all()
            else:
                returnData=testresult_orm.objects.get(id=id)
            returnList=[]
            
            if isinstance(returnData, Iterable):
                for row in returnData:
                    returnList.append(
                        cls(
                            id=row.id,
                            patient=row.patient,
                            addedAt=row.added_at,
                            description=row.description,
                            mediaUrls=row.media_urls,
                        )
                    )
                return returnList
            else:
                return cls(
                    id=returnData.id,
                    patient=returnData.patient,
                    addedAt=returnData.added_at,
                    description=returnData.description,
                    mediaUrls=returnData.media_urls,
                )
        except (testresult_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.patient=self.patient
        self._orm.added_at=self.addedAt
        self._orm.description=self.description
        self._orm.media_urls=self.mediaUrls
        self._orm.save()

        return _interface(
            id=self._orm.id,
            patient=self._orm.patient,
            addedAt=self._orm.added_at,
            description=self._orm.description,
            mediaUrls=self._orm.media_urls,
        )