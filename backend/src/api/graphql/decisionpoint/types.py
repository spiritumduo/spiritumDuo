import graphene

from ..user.types import UserType
from ..patient.types import PatientType, _InputPatientType

class DecisionPointType(graphene.ObjectType):
    id=graphene.ID()
    patient=graphene.Field(PatientType)
    clinician=graphene.Field(UserType)
    type=graphene.String()
    added_at=graphene.DateTime()
    updated_at=graphene.DateTime()
    clinic_history=graphene.String()
    comorbidities=graphene.String()

class _InputDecisionPointType(graphene.InputObjectType):
    patient=graphene.Int(required=True) # for input, we'd have to specify the FK of the entry
    clinician=graphene.Int(required=True) # for input, we'd have to specify the FK of the entry
    type=graphene.String(required=True)
    added_at=graphene.DateTime(required=True)
    updated_at=graphene.DateTime(required=True)
    clinic_history=graphene.String(required=True)
    comorbidities=graphene.String(required=True)