import graphene

from ...graphql.login.types import UserType
from ...graphql.patient.types import PatientType

class DecisionPointType(graphene.ObjectType):
    id=graphene.ID()
    patient=graphene.Field(PatientType)
    clinician=graphene.Field(UserType)
    type=graphene.String()
    addedAt=graphene.DateTime()
    updatedAt=graphene.DateTime()
    clinicHistory=graphene.String()
    comorbidities=graphene.String()

class _InputDecisionPointType(graphene.InputObjectType):
    patient=graphene.Int(required=True) # for input, we'd have to specify the FK of each
    clinician=graphene.Int(required=True) # for input, we'd have to specify the FK of each
    type=graphene.String(required=True)
    addedAt=graphene.DateTime(required=True)
    updatedAt=graphene.DateTime(required=True)
    clinicHistory=graphene.String(required=True)
    comorbidities=graphene.String(required=True)