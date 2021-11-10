from datetime import datetime
from typing import Iterable

from api.models import decisionpoint_orm

# DAO object
class DecisionPointDAO:
    def __init__(self, id:int=None, patient:int=None, clinician:int=None, pathway:int=None, type:str=None, added_at:datetime=None, updated_at:datetime=None, clinic_history:str=None, comorbidities:str=None):
        self.id=id
        self.patient=patient
        self.clinician=clinician
        self.pathway=pathway
        self.type=type
        self.added_at=added_at
        self.updated_at=updated_at
        self.clinic_history=clinic_history
        self.comorbidities=comorbidities
        self._orm: decisionpoint_orm = decisionpoint_orm()

        if id:
            self._orm.id=id
            self._orm.patient=patient
            self._orm.clinician=clinician
            self._orm.pathway=pathway
            self._orm.type=type
            self._orm.added_at=added_at
            self._orm.updated_at=updated_at
            self._orm.clinic_history=clinic_history
            self._orm.comorbidities=comorbidities

    @classmethod
    def read(cls, id:int=None, patientId:int=None):
        try:
            if id:
                returnData=decisionpoint_orm.objects.get(id=id)
            elif patientId:
                returnData=decisionpoint_orm.objects.filter(patient=patientId)
            else:
                returnData=decisionpoint_orm.objects.all()
            returnList=[]
            
            if isinstance(returnData, Iterable):
                for row in returnData:
                    returnList.append(
                        cls(
                            id=row.id,
                            patient=row.patient,
                            clinician=row.clinician,
                            pathway=row.pathway,
                            type=row.type,
                            added_at=row.added_at,
                            updated_at=row.updated_at,
                            clinic_history=row.clinic_history,
                            comorbidities=row.comorbidities,
                        )
                    )
                return returnList
            else:
                return cls(
                    id=returnData.id,
                    patient=returnData.patient,
                    clinician=returnData.clinician,
                    pathway=returnData.pathway,
                    type=returnData.type,
                    added_at=returnData.added_at,
                    updated_at=returnData.updated_at,
                    clinic_history=returnData.clinic_history,
                    comorbidities=returnData.comorbidities,
                )
        except (decisionpoint_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.patient=self.patient
        self._orm.clinician=self.clinician
        self._orm.pathway=self.pathway
        self._orm.type=self.type
        self._orm.added_at=self.added_at
        self._orm.updated_at=self.updated_at
        self._orm.clinic_history=self.clinic_history
        self._orm.comorbidities=self.comorbidities
        self._orm.save()
        self.id=self._orm.id