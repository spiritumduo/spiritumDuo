from datetime import date
from typing import Iterable

from api.models.Patient import Patient

# DAO object
class PatientDAO:
    def __init__(self, id:int=None, hospital_number:str=None, national_number:str=None, communication_method:str=None, first_name:str=None, last_name:str=None, date_of_birth:date=None):
        self.id=id
        self.hospital_number=hospital_number
        self.national_number=national_number
        self.communication_method=communication_method
        self.first_name=first_name
        self.last_name=last_name
        self.date_of_birth=date_of_birth
        self._orm: Patient=Patient()
        
        if id:
            self._orm.id=id
            self._orm.hospital_number=self.hospital_number
            self._orm.national_number=self.national_number
            self._orm.communication_method=self.communication_method
            self._orm.first_name=self.first_name
            self._orm.last_name=self.last_name
            self._orm.date_of_birth=self.date_of_birth

    @classmethod
    def read(cls, dataOnly:bool=False, id:int=None, hospital_number:int=None, national_number:int=None, first_name:str=None, last_name:str=None, date_of_birth:date=None):
        try:
            if id:
                returnData=Patient.objects.get(id=id)
            elif hospital_number:
                returnData=Patient.objects.get(hospital_number=hospital_number)
            elif national_number:
                returnData=Patient.objects.get(national_number=national_number)
            elif first_name and last_name and date_of_birth:
                returnData=Patient.objects.get(first_name=first_name, last_name=last_name, date_of_birth=date_of_birth)
            else:
                returnData=Patient.objects.all()

            returnList=[]
            
            """
                I've added a 'dataOnly' flag because when using foreign keys, Django doesn't like it 
                if the entry isn't saved. Generating a new class object with data that's technically
                not saved doesn't work, if dataOnly is flagged (and only one entry was found) it'll
                only send that data as an orm class and not the DAO class, therefore resolving the issue. 
                ~Joe
            """
            if dataOnly:
                return returnData

            if isinstance(returnData, Iterable):
                for row in returnData:
                    returnList.append(cls(
                        id=row.id,
                        hospital_number=row.hospital_number,
                        national_number=row.national_number,
                        communication_method=row.communication_method,
                        first_name=row.first_name,
                        last_name=row.last_name,
                        date_of_birth=row.date_of_birth
                    ))
                return returnList
            else:
                return cls(
                    id=returnData.id,
                    hospital_number=returnData.hospital_number,
                    national_number=returnData.national_number,
                    communication_method=returnData.communication_method,
                    first_name=returnData.first_name,
                    last_name=returnData.last_name,
                    date_of_birth=returnData.date_of_birth,
                )
        except (Patient.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.hospital_number=self.hospital_number
        self._orm.national_number=self.national_number
        self._orm.communication_method=self.communication_method
        self._orm.first_name=self.first_name
        self._orm.last_name=self.last_name
        self._orm.date_of_birth=self.date_of_birth
        self._orm.save()
        self.id=self._orm.id