import requests
import json

from typing import List

TRUST_INTEGRATION_ENGINE_ENDPOINT="http://localhost:8081/"

class IntegrationEngine:
    def __init__(self, authToken:str=None):
        self._authToken=authToken
    
    def load_patient(self, recordId:str=None, hospitalNumber:str=None, nationalNumber:str=None):
        pass

    def load_many_patients(self, recordId:List=None, hospitalNumber:List=None, nationalNumber:List=None):
        pass

    def create_milestone(self, 
        hospitalNumber:str=None,
        milestoneReference:str=None,
    ):
        pass

    def load_milestone(self, recordId:str=None):
        result = requests.get(TRUST_INTEGRATION_ENGINE_ENDPOINT+"milestone/"+recordId, cookies={"SDSESSION":self._authToken})
        if result.status_code!=200:
            raise Exception("HTTP"+result.status_code+" received")
        return result

    def load_many_milestones(self, recordIds:list=None):
        result = requests.get(TRUST_INTEGRATION_ENGINE_ENDPOINT+"milestone/"+json.loads(recordIds), cookies={"SDSESSION":self._authToken})
        if result.status_code!=200:
            raise Exception("HTTP"+result.status_code+" received")
        return result

    def login(self, username:str=None, password:str=None):
        pass
    
    def create_user(self, username:str=None, password:str=None, first_name:str=None, last_name:str=None, department:str=None):
        pass