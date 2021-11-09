"""
    TODO:
        Need to figure how this is meant to work. It's for 
        configuration, it shouldn't have more than one record?
    ~Joe
"""

from typing import Iterable
from api.models.Configuration import configuration_orm

class ConfigurationDAO:
    def __init__(self, hospital_number_name:str, hospital_number_regex:str, national_patient_number_name:str, national_patient_number_regex:str, id:int=None):
        self.id=id
        self.hospital_number_name=hospital_number_name
        self.hospital_number_regex=hospital_number_regex
        self.national_patient_number_name=national_patient_number_name
        self.national_patient_number_regex=national_patient_number_regex
        self._orm: configuration_orm = configuration_orm()
    
    @classmethod
    def read(cls):
        try:
            returnData=configuration_orm.objects.all()
            if isinstance(returnData, Iterable):
                returnList=[]
                for row in returnData:
                    returnList.append(
                        cls(
                            id=row.id,
                            hospital_number_name=row.hospital_number_name,
                            hospital_number_regex=row.hospital_number_regex,
                            national_patient_number_name=row.national_patient_number_name,
                            national_patient_number_regex=row.national_patient_number_regex,
                        )
                    )
                return returnList
            else:
                return cls(
                    id=returnData.id,
                    hospital_number_name=returnData.hospital_number_name,
                    hospital_number_regex=returnData.hospital_number_regex,
                    national_patient_number_name=returnData.national_patient_number_name,
                    national_patient_number_regex=returnData.national_patient_number_regex,
                )
        except (configuration_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.hospital_number_name=self.hospital_number_name
        self._orm.hospital_number_regex=self.hospital_number_regex
        self._orm.national_patient_number_name=self.national_patient_number_name
        self._orm.national_patient_number_regex=self.national_patient_number_regex
        self._orm.save()
        self.id=self._orm.id