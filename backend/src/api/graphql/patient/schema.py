import graphene

from .mutations import CreatePatient
from .queries import _PatientQueries
from .types import PatientType

class PatientQueries(_PatientQueries, graphene.ObjectType):
    patients=graphene.List(PatientType)
    patient_search = graphene.Field(PatientType, searchParam=graphene.String(), searchParamExtension=graphene.String())
    # this way we can keep it modular for permission decorators
    def resolve_patients(root, info):
        return _PatientQueries._resolve_patients(root, info)
    def resolve_patient_search(root, info, searchParam, searchParamExtension=None):
        return _PatientQueries._resolve_patient_search(root, info, searchParam, searchParamExtension)

class PatientMutations(graphene.ObjectType):
    create_patient=CreatePatient.Field()