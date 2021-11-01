from django.db import models
from datetime import datetime
from dataclasses import dataclass
from typing import Union

class patient_orm(models.Model):
    id = models.AutoField(primary_key=True)
    hospital_number = models.TextField()
    national_number = models.TextField()
    communication_method = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()

@dataclass # https://docs.python.org/3/library/dataclasses.html
class PatientModel:
    id: int
    hospitalNumber: str
    nationalNumber: str
    communicationMethod: str
    firstName: str
    lastName: str
    dateOfBirth: datetime
    _orm: patient_orm = patient_orm()
    
    @classmethod
    def read(cls, searchParam: Union[int, str]=None): 
        ''' 
        I remember someone mentioning searching by f/lname. 
        We could quite easily do that by adding a second argument to be used for last names
        '''
        try:
            if searchParam==None:
                return patient_orm.objects.all()
            elif searchParam.isnumeric():
                return patient_orm.objects.get(id=searchParam)
            elif searchParam:
                return patient_orm.objects.get(hospitalNumber=searchParam)
        except (patient_orm.DoesNotExist):
            return False

    def save(self):
        self._orm.hospital_number=self.hospitalNumber
        self._orm.national_number=self.nationalNumber
        self._orm.communication_method=self.communicationMethod
        self._orm.first_name=self.firstName
        self._orm.last_name=self.lastName
        self._orm.date_of_birth=self.dateOfBirth
        
        self._orm.save()
        
    def delete(self):
        self._orm.delete()
