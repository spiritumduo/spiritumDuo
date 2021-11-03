from datetime import date, datetime
from typing import Union, Iterable
from api.models.Patient import patient_orm

# Interface between database and GraphQL
class _interface:
    def __init__(self, id:int, hospitalNumber:str, nationalNumber:str, communicationMethod:str, firstName:str, lastName:str, dateOfBirth:date):
        self.id=id
        self.hospitalNumber=hospitalNumber
        self.nationalNumber=nationalNumber
        self.communicationMethod=communicationMethod
        self.firstName=firstName
        self.lastName=lastName
        self.dateOfBirth=dateOfBirth

# DAO object
class PatientDAO:
    def __init__(self, hospitalNumber:str, nationalNumber:str, communicationMethod:str, firstName:str, lastName:str, dateOfBirth: datetime):
        self.hospitalNumber=hospitalNumber
        self.nationalNumber=nationalNumber
        self.communicationMethod=communicationMethod
        self.firstName=firstName
        self.lastName=lastName
        self.dateOfBirth=dateOfBirth
        self._orm: patient_orm = patient_orm()
    
    @classmethod
    def read(cls, searchParam: Union[int, str]=None, searchParamExtension: str=None):
        try:
            '''
                1. If no search paramters, return all data
                2. If numeric, assume it's an ID therefore search by record ID
                3. If there is one search parameter, assume it's a hospital number
                4. If there are two search parameters, assume it's a first and last name
                    
                NOTE: One downside to searching by name is we need to handle if more than one record exists, 
                      requiring a user to search by ID or MRN
            '''
            if searchParam==None:
                returnData=patient_orm.objects.all()
            elif searchParam.isnumeric():
                returnData=patient_orm.objects.get(id=searchParam)
            elif searchParam and not searchParamExtension:
                returnData=patient_orm.objects.get(hospital_number=searchParam)
            else:
                returnData=patient_orm.objects.get(first_name=searchParam, last_name=searchParamExtension)
            returnList=[]
            
            if isinstance(returnData, Iterable):
                for row in returnData:
                    returnList.append(
                        _interface(
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
            else:
                return _interface(
                    id=returnData.id,
                    hospitalNumber=returnData.hospital_number,
                    nationalNumber=returnData.national_number,
                    communicationMethod=returnData.communication_method,
                    firstName=returnData.first_name,
                    lastName=returnData.last_name,
                    dateOfBirth=returnData.date_of_birth,
                )
        except (patient_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.hospital_number=self.hospitalNumber
        self._orm.national_number=self.nationalNumber
        self._orm.communication_method=self.communicationMethod
        self._orm.first_name=self.firstName
        self._orm.last_name=self.lastName
        self._orm.date_of_birth=self.dateOfBirth
        self._orm.save()

        return _interface(
            id=self._orm.id,
            hospitalNumber=self._orm.hospital_number,
            nationalNumber=self._orm.national_number,
            communicationMethod=self._orm.communication_method,
            firstName=self._orm.first_name,
            lastName=self._orm.last_name,
            dateOfBirth=self._orm.date_of_birth,
        )