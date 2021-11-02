<<<<<<< Updated upstream
from django.db import models
from datetime import datetime
from dataclasses import dataclass
from enum import Enum

from backend.api.submodels.patient import PatientModel;
from backend.api.submodels.user import UserModel;

class DecisionPointTypes(Enum):
    TRIAGE="TRIAGE"
    CLINIC="CLINIC"
    MDT="MDT"
    AD_HOC="AD_HOC"
    FOLLOW_UP="FOLLOW_UP"
    
    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

class decision_orm(models.Model):
    id=models.AutoField(primary_key=True)
    patient=models.ForeignKey(
        PatientModel._orm, # NOTE: need to look over whether this is allowed use of ORM model!
        on_delete=models.CASCADE
    ) 
    clinician=models.ForeignKey(
        UserModel._orm, # NOTE: need to look over whether this is allowed use of ORM model!
        on_delete=models.CASCADE
    )
    type = models.CharField(
      max_length=10,
      choices=DecisionPointTypes.choices()
    )
    addedAt=models.DateTimeField()
    updatedAt=models.DateTimeField()
    clinicHistory=models.TextField()
    comorbidities=models.TextField()

@dataclass
class DecisionPointModel:
    id:str
    patient:PatientModel._orm = None
    clinician:UserModel._orm = None
    type:str = None
    addedAt:datetime = None
    updatedAt:datetime = None
    clinicHistory:str = None
    comorbidities:str = None
    _orm: decision_orm = decision_orm()
    
    @classmethod
    def read(cls, searchParam:int=None):
        try:
            if not searchParam:
                return decision_orm.objects.all()
            else:
                return decision_orm.objects.get(id=searchParam)
        except (decision_orm.DoesNotExist):
            return False

    def save(self):
        self._orm.id=self.id
        self._orm.patient=self.patient
        self._orm.clinician=self.clinician
        self._orm.type=self.type
        self._orm.addedAt=self.addedAt
        self._orm.updatedAt=self.updatedAt
        self._orm.clinicHistory=self.clinicHistory
        self._orm.comorbidities=self.comorbidities

        self._orm.save()
        
    def delete(self):
        self._orm.delete()
=======
# from django.db import models
# from datetime import datetime
# from dataclasses import dataclass
# from enum import Enum

# from backend.api.submodels.patient import PatientModel;
# from backend.api.submodels.user import UserModel;

# class DecisionPointTypes(Enum):
#     TRIAGE="TRIAGE"
#     CLINIC="CLINIC"
#     MDT="MDT"
#     AD_HOC="AD_HOC"
#     FOLLOW_UP="FOLLOW_UP"
    
#     @classmethod
#     def choices(cls):
#         return tuple((i.name, i.value) for i in cls)

# class decision_orm(models.Model):
#     patient=models.ForeignKey(
#         PatientModel._orm,
#         on_delete=models.CASCADE
#     ) 
#     clinician=models.ForeignKey(
#         UserModel._orm,
#         on_delete=models.CASCADE
#     )
#     type = models.CharField(
#       max_length=10,
#       choices=DecisionPointTypes.choices()
#     )
#     addedAt=models.DateTimeField()
#     updatedAt=models.DateTimeField()
#     clinicHistory=models.TextField()
#     comorbidities=models.TextField()

# @dataclass
# class DecisionPointModel:
#     id:str
#     patient:PatientModel._orm = None
#     clinician:UserModel._orm = None
#     type:str = None
#     addedAt:datetime = None
#     updatedAt:datetime = None
#     clinicHistory:str = None
#     comorbidities:str = None
#     _orm: decision_orm = decision_orm()
    
#     @classmethod
#     def read(cls, searchParam:int=None):
#         try:
#             if not searchParam:
#                 return decision_orm.objects.all()
#             else:
#                 return decision_orm.objects.get(id=searchParam)
#         except (decision_orm.DoesNotExist):
#             return False

#     def save(self):
#         self._orm.id=self.id
#         self._orm.patient=self.patient
#         self._orm.clinician=self.clinician
#         self._orm.type=self.type
#         self._orm.addedAt=self.addedAt
#         self._orm.updatedAt=self.updatedAt
#         self._orm.clinicHistory=self.clinicHistory
#         self._orm.comorbidities=self.comorbidities

#         self._orm.save()
        
#     def delete(self):
#         self._orm.delete()
>>>>>>> Stashed changes




