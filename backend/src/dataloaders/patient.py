from aiodataloader import DataLoader
from dependency_injector.wiring import Provide, inject

from containers import SDContainer
from models import Patient
from datetime import date
from typing import List, Union, Dict, Optional
from trustadapter import TrustAdapter

class PatientByIdLoader(DataLoader):
    """
        This is class for loading patients and 
        caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """
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

    async def batch_load_fn(self, keys)->Dict[str, Patient]:
        patientDict=await self.fetch([int(i) for i in keys])
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(int(key)))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Union[Patient, None]:
        """
            Load a single entry from its record ID
            
            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns: 
                Patient/None
        """
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        patient=await context[cls.loader_name].load(id)

        if patient:
            if not PatientByHospitalNumberLoader.loader_name in context:
                context[PatientByHospitalNumberLoader.loader_name]=PatientByHospitalNumberLoader(db=context['db'])
            context[PatientByHospitalNumberLoader.loader_name].prime(patient.hospital_number, patient)

        return patient

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[Patient], None]:
        """
            Load a multiple entries from their record ID
            
            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns: 
                List[Patient]/None
        """
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

class PatientByHospitalNumberLoader(DataLoader):
    """
        This is class for loading patients by their
        hospital numbers and caching the result in 
        the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name="_patient_by_hospital_number_loader"
    _db=None

    def __init__(self, db):
        super().__init__()
        self._db=db

    async def fetch(self, keys)->Dict[str, Patient]:
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
    async def load_from_id(cls, context=None, id=None)->Union[Patient, None]:
        """
            Load a single entry from its hospital number
            
            Parameters:
                context (dict): request context
                id (str): ID to find
            Returns: 
                Patient/None
        """
        if not id:
            return None
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        patient=await context[cls.loader_name].load(id)

        if patient:
            if not PatientByIdLoader.loader_name in context:
                context[PatientByIdLoader.loader_name]=PatientByIdLoader(db=context['db'])
            context[PatientByIdLoader.loader_name].prime(patient.id, patient)

        return patient

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->Union[List[Patient], None]:
        """
            Loads many entries from their hospital numbers
            
            Parameters:
                context (dict): request context
                ids (List[str]): IDs to find
            Returns: 
                List[Patient]/None
        """
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)


class ReferencePatient:
    id:str=None
    firstName:str=None
    lastName:str=None
    hospitalNumber:str=None
    nationalNumber:str=None
    dateOfBirth:date=None


class PatientByHospitalNumberFromIELoader(DataLoader):
    """
        This is class for loading patients by their
        hospital numbers and caching the result in 
        the request context from the TrustAdapter

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """
    loader_name = "_patient_by_hospital_number_from_ie_loader"

    def __init__(self, context=None):
        super().__init__()
        self._context=context

    @inject
    async def fetch(
            self, keys, trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
    ) -> Dict[str, ReferencePatient]:
        result = await trust_adapter.load_many_patients(
            hospitalNumbers=keys,
            auth_token=self._context['request'].cookies['SDSESSION']
        )
        returnData = {}
        for patient in result:
            returnData[patient.hospital_number] = patient
        return returnData

    async def batch_load_fn(self, keys)->List[Patient]:
        patientDict=await self.fetch(keys)
        sortedPatients=[]
        for key in keys:
            sortedPatients.append(patientDict.get(key))
        return sortedPatients



    @classmethod
    def _get_loader_from_context(cls, context) -> "PatientByHospitalNumberFromIELoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(context=context)
        return context[cls.loader_name]

    @classmethod
    async def load_from_id(cls, context=None, id=None)->Optional[ReferencePatient]:
        """
            Load a single entry from its hospital number from the TrustAdapter
            
            Parameters:
                context (dict): request context
                id (str): ID to find
            Returns: 
                ReferencePatient/None
        """
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None)->List[Optional[ReferencePatient]]:
        """
            Loads multiple entries from their hospital number from the TrustAdapter
            
            Parameters:
                context (dict): request context
                ids (List[str]): ID to find
            Returns: 
                List[ReferencePatient]/None
        """
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)