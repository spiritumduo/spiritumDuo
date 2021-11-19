from typing import List
from aiodataloader import DataLoader
from asgiref.sync import sync_to_async
from api.models import Patient

class PatientLoader(DataLoader):
    @sync_to_async
    def fetch_patients(self, keys)->List[Patient]:
        patients=Patient.objects.in_bulk(keys)
        return patients
    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch_patients(keys)
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(int(key), None))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        loader_name="_patient_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        patient=await context[loader_name].load(ids)
        return patient