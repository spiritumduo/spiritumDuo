from django.db import models
from typing import Iterable

class configuration_orm(models.Model):
    hospital_number_name=models.TextField()
    hospital_number_regex=models.TextField()
    national_patient_number_name=models.TextField()
    national_patient_number_regex=models.TextField()

class ConfigurationInterface:
    def __init__(self, hospitalNumberName:str, hospitalNumberRegex:str, nationalPatientNumberName:str, nationalPatientNumberRegex:str):
        self.hospitalNumberName=hospitalNumberName
        self.hospitalNumberRegex=hospitalNumberRegex
        self.nationalPatientNumberName=nationalPatientNumberName
        self.nationalPatientNumberRegex=nationalPatientNumberRegex

class ConfigurationModel:
    def __init__(self, hospitalNumberName:str, hospitalNumberRegex:str, nationalPatientNumberName:str, nationalPatientNumberRegex:str):
        self.hospitalNumberName=hospitalNumberName
        self.hospitalNumberRegex=hospitalNumberRegex
        self.nationalPatientNumberName=nationalPatientNumberName
        self.nationalPatientNumberRegex=nationalPatientNumberRegex
        self._orm: configuration_orm = configuration_orm()
    
    @classmethod
    def read(cls):
        try:
            returnData=configuration_orm.objects.all()
            if isinstance(returnData, Iterable):
                returnList=[]
                for row in returnData:
                    returnList.append(
                        ConfigurationInterface(
                            hospitalNumberName=row.hospital_number_name,
                            hospitalNumberRegex=row.hospital_number_regex,
                            nationalPatientNumberName=row.national_patient_number_name,
                            nationalPatientNumberRegex=row.national_patient_number_regex,
                        )
                    )
                return returnList
            else:
                return ConfigurationInterface(
                    hospitalNumberName=returnData.hospital_number_name,
                    hospitalNumberRegex=returnData.hospital_number_regex,
                    nationalPatientNumberName=returnData.national_patient_number_name,
                    nationalPatientNumberRegex=returnData.national_patient_number_regex,
                )
        except (configuration_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.hospital_number_name=self.hospitalNumberName
        self._orm.hospital_number_regex=self.hospitalNumberRegex
        self._orm.national_patient_number_name=self.nationalPatientNumberName
        self._orm.national_patient_number_regex=self.nationalPatientNumberRegex
        self._orm.save()

        return ConfigurationInterface(
            hospitalNumberName=self._orm.hospital_number_name,
            hospitalNumberRegex=self._orm.hospital_number_regex,
            nationalPatientNumberName=self._orm.national_patient_number_name,
            nationalPatientNumberRegex=self._orm.national_patient_number_regex,
        )