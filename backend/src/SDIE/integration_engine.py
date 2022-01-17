import requests
from typing import List

class IntegrationEngine:
    def __init__(self, authToken:str=None):
        self._authToken=authToken
    
    def load_patient(self, recordId:str=None, hospitalNumber:int=None, nationalNumber:int=None):
        pass

    def load_many_patients(self, recordId:List=None, hospitalNumber:List=None, nationalNumber:List=None):
        pass

    def login(self, username:str=None, password:str=None):
        pass
    
    def create_user(self, username:str=None, password:str=None, first_name:str=None, last_name:str=None, department:str=None):
        pass