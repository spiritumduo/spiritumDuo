# from typing import Union
# from django.db import models
# from datetime import datetime
# from dataclasses import dataclass

# from backend.api.submodels.patient import PatientModel;

# class testresult_orm(models.Model):
#     patient=models.ForeignKey(
#         PatientModel._orm,
#         on_delete=models.CASCADE
#     ) 
#     addedAt=models.DateTimeField()
#     description=models.TextField()
#     mediaUrls=models.TextField()

# @dataclass
# class TestResultModel:
#     id:int
#     patient:PatientModel._orm = None
#     addedAt:datetime._orm = None
#     description:str = None
#     mediaUrls:str = None

#     _orm: testresult_orm = testresult_orm()
    
#     @classmethod
#     def read(cls, searchParam:int=None):
#         try:
#             if not searchParam:
#                 return testresult_orm.objects.all()
#             else:
#                 return testresult_orm.objects.get(id=searchParam)
#         except (testresult_orm.DoesNotExist):
#             return False

#     def save(self):
#         self._orm.id=self.id
#         self._orm.patient=self.patient
#         self._orm.addedAt=self.addedAt
#         self._orm.description=self.description
#         self._orm.mediaUrls=self.mediaUrls

#         self._orm.save()
        
#     def delete(self):
#         self._orm.delete()