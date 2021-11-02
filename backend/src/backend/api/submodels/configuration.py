<<<<<<< Updated upstream
from django.db import models
from dataclasses import dataclass

class config_orm(models.Model):
    hospitalNumberName=models.TextField()
    hospitalNumberRegex=models.TextField()
    nationalPatientNumberName=models.TextField()
    nationalPatientNumberRegex=models.TextField()

@dataclass
class ConfigModel:
    hospitalNumberName:str
    hospitalNumberRegex:str
    nationalPatientNumberName:str
    nationalPatientNumberRegex:str
    _orm: config_orm = config_orm()
    
    @classmethod
    def read(cls):
        try:
            return config_orm.objects.all()
        except (config_orm.DoesNotExist):
            return False

    def save(self):
        self._orm.hospitalNumberName=self.hospitalNumberName
        self._orm.hospitalNumberRegex=self.hospitalNumberRegex
        self._orm.nationalPatientNumberName=self.nationalPatientNumberName
        self._orm.nationalPatientNumberRegex=self.nationalPatientNumberRegex
        
        self._orm.save()
        
    def delete(self):
        self._orm.delete()
=======
# from django.db import models
# from dataclasses import dataclass

# class config_orm(models.Model):
#     hospitalNumberName=models.TextField()
#     hospitalNumberRegex=models.TextField()
#     nationalPatientNumberName=models.TextField()
#     nationalPatientNumberRegex=models.TextField()

# @dataclass
# class ConfigModel:
#     hospitalNumberName:str
#     hospitalNumberRegex:str
#     nationalPatientNumberName:str
#     nationalPatientNumberRegex:str
#     _orm: config_orm = config_orm()
    
#     @classmethod
#     def read(cls):
#         try:
#             return config_orm.objects.all()
#         except (config_orm.DoesNotExist):
#             return False

#     def save(self):
#         self._orm.hospitalNumberName=self.hospitalNumberName
#         self._orm.hospitalNumberRegex=self.hospitalNumberRegex
#         self._orm.nationalPatientNumberName=self.nationalPatientNumberName
#         self._orm.nationalPatientNumberRegex=self.nationalPatientNumberRegex
        
#         self._orm.save()
        
#     def delete(self):
#         self._orm.delete()
>>>>>>> Stashed changes
