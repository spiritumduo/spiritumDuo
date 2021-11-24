from typing import List
from aiodataloader import DataLoader
from api.common import database_sync_to_async
from api.models import Patient

class PatientLoader(DataLoader):
    @database_sync_to_async
    def fetch_patients(self, keys)->List[Patient]:
        return Patient.objects.in_bulk(id_list=keys)

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch_patients(keys)
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

    @classmethod
    async def load_many_patients(cls, context=None, ids=None):
        loader_name = "_patient_loader"
        if loader_name not in context:
            context[loader_name] = cls()
        return await context[loader_name].load_many(ids)

class PatientLoaderByHospitalNumber(DataLoader):
    @database_sync_to_async
    def fetch_patients(self, keys)->List[Patient]:
        return Patient.objects.in_bulk(id_list=keys, field_name="hospital_number")

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch_patients(keys)
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(str(key)))
        return sortedPatients

    @classmethod
    async def load_data(cls, context=None, hospital_number=None):
        if not hospital_number:
            return None
        loader_name="_patient_loader_hosp_num"
        if loader_name not in context:
            context[loader_name]=cls()
        patient=await context[loader_name].load(hospital_number)
        return patient

    @classmethod
    async def load_many_patients(cls, context=None, ids=None):
        loader_name = "_patient_loader"
        if loader_name not in context:
            context[loader_name] = cls()
        return await context[loader_name].load_many(ids)
