from django.db import models
from datetime import datetime
from dataclasses import dataclass


class _PatientOrm(models.Model):
    id = models.IntegerField(primary_key=True)
    hospitalNumber = models.TextField()
    nationalNumber = models.TextField()
    communicationMethod = models.TextField()
    firstName = models.TextField()
    lastName = models.TextField()
    dateOfBirth = models.DateField()


# https://docs.python.org/3/library/dataclasses.html
# Finally getting close to structs in Python!
@dataclass
class PatientModel:
    _patientOrm: _PatientOrm
    id: int
    hospitalNumber: str = None
    nationalNumber: str = None
    communicationMethod: str = None
    firstName: str = None
    lastName: str = None
    dateOfBirth: datetime = None
    
    def __init__(self, id: int, hospitalNumber: str, nationalNumber: str,
                 communicationMethod: str, firstName: str, lastName:str,
                 dateOfBirth: datetime):
        self.id = id
        self.hospitalNumber = hospitalNumber
        self.nationalNumber = nationalNumber
        self.communicationMethod = communicationMethod
        self.firstName = firstName
        self.lastName = lastName
        self.dateOfBirth = dateOfBirth

        self._patientOrm = _PatientOrm(
            id=self.id,
            hospitalNumber=self.hospitalNumber,
            nationalNumber=self.nationalNumber,
            communicationMethod=self.communicationMethod,
            firstName=self.firstName,
            lastName=self.lastName,
            dateOfBirth=self.dateOfBirth
        )
        
    
    def save(self):
        self._patientOrm.save()

    @classmethod
    def read(cls, id: int):
        patientOrm = _PatientOrm.objects.filter(id=id)
        patientModel =  cls(
            id = patientOrm.id,
            hospitalNumber=patientOrm.hospitalNumber,
            nationalNumber=patientOrm.nationalNumber,
            communicationMethod=patientOrm.communicationMethod,
            firstName=patientOrm.firstName,
            lastName=patientOrm.lastName,
            dateOfBirth=patientOrm.dateOfBirth,
        )

        patientModel._patientOrm = patientOrm
        return patientModel

    def delete(self):
        self._patientOrm.delete()





