from datetime import datetime
from typing import Iterable

from api.models import TestResult

# DAO object
class TestResultDAO:
    def __init__(self, id:int=None, patient:int=None, added_at:datetime=None, description:str=None, media_urls:str=None):
        self.id=id
        self.patient=patient
        self.added_at=added_at
        self.description=description
        self.media_urls=media_urls
        self._orm: TestResult = TestResult()

        if id:
            self._orm.id=id
            self._orm.patient=self.patient
            self._orm.added_at=self.added_at
            self._orm.description=self.description
            self._orm.media_urls=self.media_urls
    
    @classmethod
    def read(cls, id:int=None, patientId:int=None):
        try:
            if id:
                returnData=TestResult.objects.get(id=id)
            elif patientId:
                returnData=TestResult.objects.filter(patient=patientId)
            else:
                returnData=TestResult.objects.all()
            returnList=[]
            
            if isinstance(returnData, Iterable):
                for row in returnData:
                    returnList.append(
                        cls(
                            id=row.id,
                            patient=row.patient,
                            added_at=row.added_at,
                            description=row.description,
                            media_urls=row.media_urls,
                        )
                    )
                return returnList
            else:
                return cls(
                    id=returnData.id,
                    patient=returnData.patient,
                    added_at=returnData.added_at,
                    description=returnData.description,
                    media_urls=returnData.media_urls,
                )
        except (TestResult.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.patient=self.patient
        self._orm.added_at=self.added_at
        self._orm.description=self.description
        self._orm.media_urls=self.media_urls
        self._orm.save()
        self.id=self._orm.id