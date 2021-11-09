import graphene

from ..user.types import UserType
from ..patient.types import PatientType

class DecisionPointType(graphene.ObjectType):
    id=graphene.ID()
    patient=graphene.Field(PatientType) # For Django-parsed data from FK relation
    clinician=graphene.Field(UserType) # For Django-parsed data from FK relation
    type=graphene.String()
    added_at=graphene.DateTime() ## YYYY-MM-DDTHH:MM:SS+TZHH:TZMM
    updated_at=graphene.DateTime() ## YYYY-MM-DDTHH:MM:SS+TZHH:TZMM
    clinic_history=graphene.String()
    comorbidities=graphene.String()

class _InputDecisionPointType(graphene.InputObjectType):
    patient=graphene.Int(required=True) # for FK relation
    clinician=graphene.Int(required=True) # for FK relation
    type=graphene.String(required=True) # TODO: need to find best way to integrate DP type enum
    added_at=graphene.DateTime(required=True)
    updated_at=graphene.DateTime(required=True)
    clinic_history=graphene.String(required=True)
    comorbidities=graphene.String(required=True)