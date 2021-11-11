from typing import Iterable
from api.models.Pathway import Pathway
from api.models.Patient import PathwayPatient, Patient
from api.dao.PatientDAO import PatientDAO

class PathwayDAO:
    def __init__(self, id:int=None, name:str=None):
        self.id=id
        self.name=name
        self._orm: Pathway = Pathway()
        if id:
            self._orm.id=id
            self._orm.name=name
    
    @classmethod
    def read(cls, id:int=None, name:str=None, dataOnly:bool=False):
        try:
            if id:
                returnData=Pathway.objects.get(id=id)
            elif name:
                returnData=Pathway.objects.get(name=name)
            else:
                returnData=Pathway.objects.all()

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

        except (Pathway.DoesNotExist):
            return False

    @classmethod
    def readRelations(cls, patientId:int=None, pathwayId:int=None): # this will get a patient's pathways
        try:
            if patientId:
                returnData=PathwayPatient.objects.filter(patient=patientId)
                returnList=[]
                for row in returnData:
                    returnList.append(
                        cls(
                            id=row.pathway.id,
                            name=row.pathway.name,
                        )
                    )
                return returnList
            elif pathwayId:
                returnData=PathwayPatient.objects.filter(pathway=pathwayId)
                returnList=[]
                for row in returnData:
                    returnList.append(
                        PatientDAO(
                            id=row.patient.id,
                            hospital_number=row.patient.hospital_number,
                            national_number=row.patient.national_number,
                            communication_method=row.patient.communication_method,
                            first_name=row.patient.first_name,
                            last_name=row.patient.last_name,
                            date_of_birth=row.patient.date_of_birth
                        )
                    )
                return returnList

        except (PathwayPatient.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.name=self.name
        self._orm.save()
        self.id=self._orm.id