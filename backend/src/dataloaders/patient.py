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
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> List[Patient]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = Patient.query.where(Patient.id.in_(keys))
            result: List[Patient] = await conn.all(query)
        returnData = {}
        for key in keys:
            returnData[key] = None
        for row in result:
            returnData[row.id] = row

        return returnData

    async def batch_load_fn(self, keys) -> Dict[str, Patient]:
        patientDict = await self.fetch([int(i) for i in keys])
        sortedPatients = []
        for key in keys:
            sortedPatients.append(patientDict.get(int(key)))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[Patient, None]:
        """
            Load a single entry from its record ID

            :param context: request context
            :param id: ID to find

            :return: Patient/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        patient: Union[Patient, None] = await context[cls.loader_name].load(id)

        if patient is not None:
            PatientByHospitalNumberLoader.prime(
                patient.hospital_number, patient,
                context=context
            )

        return patient

    @classmethod
    async def load_many_from_id(
        cls, context=None, ids=None
    ) -> Union[List[Patient], None]:
        """
            Load a multiple entries from their record ID

            :param context: request context
            :param id: IDs to find

            :return: List[Patient]

            :raise TypeError:
        """
        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    def prime(cls, key=None, value=None, context=None):
        if context is None:
            raise TypeError("context cannot be None type")

        if key is None:
            raise TypeError("key cannot be None type")

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return super(PatientByIdLoader, context[cls.loader_name]).prime(
            key=key, value=value)


class PatientByHospitalNumberLoader(DataLoader):
    """
        This is class for loading patients by their
        hospital numbers and caching the result in
        the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_patient_by_hospital_number_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    async def fetch(self, keys) -> Dict[str, Patient]:
        result = None
        async with self._db.acquire(reuse=False) as conn:
            query = Patient.query.where(Patient.hospital_number.in_(keys))
            result: List[Patient] = await conn.all(query)
        returnData = {}
        for row in result:
            returnData[row.hospital_number] = row

        return returnData

    async def batch_load_fn(self, keys) -> List[Patient]:
        patientDict = await self.fetch(keys)
        sortedPatients = []
        for key in keys:
            sortedPatients.append(patientDict.get(key))
        return sortedPatients

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Union[Patient, None]:
        """
            Load a single entry from its hospital number

            :param context: request context
            :param id: ID to find

            :return: Patient/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        patient: Union[Patient, None] = await context[cls.loader_name].load(id)

        if patient is not None:
            PatientByIdLoader.prime(patient.id, patient, context=context)

        return patient

    @classmethod
    async def load_many_from_id(
        cls, context=None, ids=None
    ) -> Union[List[Patient], None]:
        """
            Loads many entries from their hospital numbers

            :param context: request context
            :param ids: IDs to find

            :return: List[Patient]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return await context[cls.loader_name].load_many(ids)

    @classmethod
    def prime(cls, key=None, value=None, context=None):
        """
            Primes the dataloader with new data using kvp

            :param context: request context
            :param key: ID of object
            :param value: object

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if key is None:
            raise TypeError("key cannot be None type")

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return super(
            PatientByHospitalNumberLoader,
            context[cls.loader_name]
        ).prime(key=key, value=value)


class ReferencePatient:
    id: str = None
    firstName: str = None
    lastName: str = None
    hospitalNumber: str = None
    nationalNumber: str = None
    dateOfBirth: date = None


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
        self._context = context

    @inject
    async def fetch(
        self, keys,
        trust_adapter: TrustAdapter = Provide[
            SDContainer.trust_adapter_service
        ]
    ) -> Dict[str, ReferencePatient]:
        result = await trust_adapter.load_many_patients(
            hospitalNumbers=keys,
            auth_token=self._context['request'].cookies['SDSESSION']
        )
        returnData = {}
        for patient in result:
            returnData[patient.hospital_number] = patient
        return returnData

    async def batch_load_fn(self, keys) -> List[Patient]:
        patientDict = await self.fetch(keys)
        sortedPatients = []
        for key in keys:
            sortedPatients.append(patientDict.get(key))
        return sortedPatients

    @classmethod
    def _get_loader_from_context(
        cls, context
    ) -> "PatientByHospitalNumberFromIELoader":
        if context is None:
            raise TypeError("context cannot be None type")

        if cls.loader_name not in context:
            context[cls.loader_name] = cls(context=context)
        return context[cls.loader_name]

    @classmethod
    async def load_from_id(
        cls, context=None, id=None
    ) -> Optional[ReferencePatient]:
        """
            Load a single entry from its hospital number from the TrustAdapter

            :param context: request context
            :param id: ID to find

            :return: ReferencePatient/None

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if id is None:
            return None

        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(
        cls,
        context=None,
        ids=None
    ) -> List[Optional[ReferencePatient]]:
        """
            Loads multiple entries from their hospital number
            from the TrustAdapter

            :param context: request context
            :param ids: ID to find

            :return: List[ReferencePatient]

            :raise TypeError:
        """

        if context is None:
            raise TypeError("context cannot be None type")

        if ids is None:
            return []

        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    def prime(cls, key=None, value=None, context=None):
        """
            Primes the dataloader with new data using kvp

            :param context: request context
            :param key: ID of object
            :param value: object

            :raise TypeError:
        """
        if key is None:
            raise TypeError("key cannot be None type")
        if context is None:
            raise TypeError("context cannot be None type")

        loader = cls._get_loader_from_context(context)
        return super(PatientByHospitalNumberFromIELoader, loader).prime(
            key=key, value=value)
