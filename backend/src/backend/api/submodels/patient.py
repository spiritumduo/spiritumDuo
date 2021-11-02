from django.db import models
<<<<<<< Updated upstream
from datetime import datetime
from dataclasses import dataclass
from typing import Union

class patient_orm(models.Model):
    id = models.AutoField(primary_key=True)
=======
from datetime import date, datetime
from typing import Union

class patient_orm(models.Model):
>>>>>>> Stashed changes
    hospital_number = models.TextField()
    national_number = models.TextField()
    communication_method = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()

<<<<<<< Updated upstream
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

=======
class PatientInterface:
    def __init__(self, id:int, hospitalNumber:str, nationalNumber:str, communicationMethod:str, firstName:str, lastName:str, dateOfBirth:date):
        self.id=id
        self.hospitalNumber=hospitalNumber
        self.nationalNumber=nationalNumber
        self.communicationMethod=communicationMethod
        self.firstName=firstName
        self.lastName=lastName
        self.dateOfBirth=dateOfBirth


class PatientModel:
    def __init__(self, hospitalNumber:str, nationalNumber:str, communicationMethod:str, firstName:str, lastName:str, dateOfBirth: datetime):
        self.hospitalNumber=hospitalNumber
        self.nationalNumber=nationalNumber
        self.communicationMethod=communicationMethod
        self.firstName=firstName
        self.lastName=lastName
        self.dateOfBirth=dateOfBirth
        self._orm: patient_orm = patient_orm()
    
    @classmethod
    def read(cls, searchParam: Union[int, str]=None):
        try:
            if searchParam==None:
                returnData=patient_orm.objects.all()
            elif searchParam.isnumeric():
                returnData=patient_orm.objects.get(patient_id=searchParam)
            elif searchParam:
                returnData=patient_orm.objects.get(hospital_number=searchParam)
            returnList=[]
            
            for row in returnData:
                returnList.append(
                    PatientInterface(
                        id=row.id,
                        hospitalNumber=row.hospital_number,
                        nationalNumber=row.national_number,
                        communicationMethod=row.communication_method,
                        firstName=row.first_name,
                        lastName=row.last_name,
                        dateOfBirth=row.date_of_birth,
                    )
                )
            return returnList
        except (patient_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()

>>>>>>> Stashed changes
    def save(self):
        self._orm.hospital_number=self.hospitalNumber
        self._orm.national_number=self.nationalNumber
        self._orm.communication_method=self.communicationMethod
        self._orm.first_name=self.firstName
        self._orm.last_name=self.lastName
        self._orm.date_of_birth=self.dateOfBirth
<<<<<<< Updated upstream
        
        self._orm.save()
        
    def delete(self):
        self._orm.delete()
=======
        self._orm.save()

        return PatientInterface(
            id=self._orm.id,
            hospitalNumber=self._orm.hospital_number,
            nationalNumber=self._orm.national_number,
            communicationMethod=self._orm.communication_method,
            firstName=self._orm.first_name,
            lastName=self._orm.last_name,
            dateOfBirth=self._orm.date_of_birth,
        )
>>>>>>> Stashed changes
