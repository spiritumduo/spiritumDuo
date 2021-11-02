from django.db import models

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
            returnData=configuration_orm.objects.filter()
            return ConfigurationInterface(
                hospitalNumberName=returnData.hospitalNumberName,
                hospitalNumberRegex=returnData.hospitalNumberRegex,
                nationalPatientNumberName=returnData.nationalPatientNumberName,
                nationalPatientNumberRegex=returnData.nationalPatientNumberRegex,
            )
        except (configuration_orm.DoesNotExist):
            return False

    def delete(self):
        self._orm.delete()
        
    def save(self):
        self._orm.hospital_number_name=self.hospital_number_name
        self._orm.hospital_number_regex=self.hospital_number_regex
        self._orm.national_patient_number_name=self.national_patient_number_name
        self._orm.national_patient_number_regex=self.national_patient_number_rege
        self._orm.save()

        return ConfigurationInterface(
            hospital_number_name=self._orm.hospital_number_name,
            hospital_number_regex=self._orm.hospital_number_regex,
            national_patient_number_name=self._orm.national_patient_number_name,
            national_patient_number_regex=self._orm.national_patient_number_regex,
        )