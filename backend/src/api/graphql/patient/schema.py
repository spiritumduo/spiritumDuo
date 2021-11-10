import graphene

from .mutations import CreatePatient, AssignPathwayToPatient
from .queries import _PatientQueries
from .types import PatientType

class PatientQueries(_PatientQueries, graphene.ObjectType):
    get_patients=graphene.List(PatientType)
    get_patient_by_search = graphene.Field(PatientType, 
        id=graphene.Int(),
        hospital_number=graphene.Int(),
        national_number=graphene.Int(),
        first_name=graphene.String(),
        last_name=graphene.String(),
        date_of_birth=graphene.Date(),
    )
    # this way we can keep it modular for permission decorators
    def resolve_get_patients(root, info):
        return _PatientQueries._resolve_get_patients(root, info)
    def resolve_get_patient_by_search(root, info, id=None, hospital_number=None, national_number=None, first_name=None, last_name=None, date_of_birth=None):
        return _PatientQueries._resolve_get_patient_by_search(root, info, id=id, hospital_number=hospital_number, national_number=national_number, first_name=first_name, last_name=last_name, date_of_birth=date_of_birth)

class PatientMutations(graphene.ObjectType):
    create_patient=CreatePatient.Field()
    assign_patient_to_pathway=AssignPathwayToPatient.Field()