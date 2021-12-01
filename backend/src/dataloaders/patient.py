from aiodataloader import DataLoader
from models import Patient
from typing import List

class PatientDataLoader(DataLoader):
    async def fetch(self, keys)->List[Patient]:
        _dict={}
        for key in keys:
            _dict[int(key)]=await Patient.query.where(Patient.id==int(key)).gino.first()
        return _dict

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch(keys)
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(int(key)))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        if not ids:
            return None
        loader_name="_patient_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        patient=await context[loader_name].load(ids)
        return patient

    # @classmethod
    # async def load_many_from_id(cls, context=None, ids=None):
    #     loader_name = "_patient_loader"
    #     if loader_name not in context:
    #         context[loader_name] = cls()
    #     return await context[loader_name].load_many(ids)