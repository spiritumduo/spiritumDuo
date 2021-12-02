from aiodataloader import DataLoader
from models import Patient
from typing import List

class PatientByIdLoader(DataLoader):
    loader_name = "_patient_by_id_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[Patient]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=Patient.query.where(Patient.id.in_(keys))
            result=await conn.all(query)
        returnData={}
        for key in keys:
            returnData[key]=None
        for row in result:
            returnData[row.id]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch([int(i) for i in keys])
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(int(key)))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, id=None):
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        patient=await context[cls.loader_name].load(id)

        if not PatientByHospitalNumberLoader.loader_name in context:
            context[PatientByHospitalNumberLoader.loader_name]=PatientByHospitalNumberLoader(db=context['db'])
        context[PatientByHospitalNumberLoader.loader_name].prime(patient.hospital_number, patient)

        return patient

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None):
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)


class PatientByHospitalNumberLoader(DataLoader):
    loader_name="_patient_by_hospital_number_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->List[Patient]:
        result=None
        async with self._db.acquire(reuse=False) as conn:
            query=Patient.query.where(Patient.hospital_number.in_(keys))
            result=await conn.all(query)
        returnData={}
        for row in result:
            returnData[row.hospital_number]=row
            
        return returnData

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch(keys)
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(key))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, ids=None):
        if not ids:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        patient=await context[cls.loader_name].load(ids)

        if not PatientByIdLoader.loader_name in context:
            context[PatientByIdLoader.loader_name]=PatientByIdLoader(db=context['db'])
        context[PatientByIdLoader.loader_name].prime(patient.id, patient)

        return patient

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None):
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)
