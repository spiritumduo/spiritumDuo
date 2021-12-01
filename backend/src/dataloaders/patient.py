from aiodataloader import DataLoader
from models import Patient
from typing import List

class PatientByIdLoader(DataLoader):
    loader_name = "_patient_by_id_loader"

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
        loader_name="_patient_by_id_loader"
        if loader_name not in context:
            context[loader_name]=cls()
        patient=await context[loader_name].load(ids)

        if not PatientByHospitalNumberLoader.loader_name in context:
            context[PatientByHospitalNumberLoader.loader_name]=PatientByHospitalNumberLoader()
        context[PatientByHospitalNumberLoader.loader_name].prime(patient.hospital_number, patient)

        return patient

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None):
        if cls.loader_name not in context:
            context[cls.loader_name] = cls()
        return await context[cls.loader_name].load_many(ids)


class PatientByHospitalNumberLoader(DataLoader):
    loader_name="_patient_by_hospital_number_loader"

    async def fetch(self, keys)->List[Patient]:
        _dict={}
        for key in keys:
            _dict[str(key)]=await Patient.query.where(Patient.hospital_number==str(key)).gino.first()
        return _dict

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        if not ids:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name]=cls()
        patient=await context[cls.loader_name].load(ids)

        if not PatientByIdLoader.loader_name in context:
            context[PatientByIdLoader.loader_name]=PatientByIdLoader()
        context[PatientByIdLoader.loader_name].prime(patient.id, patient)

        return patient

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch(keys)
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(str(key)))
        return sortedPatients