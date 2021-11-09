import graphene

from ..patient.types import PatientType

class TestResultType(graphene.ObjectType):
    id=graphene.ID()
    patient=graphene.Field(PatientType)
    added_at=graphene.DateTime()
    description=graphene.String()
    media_urls=graphene.String()

class _InputTestResultType(graphene.InputObjectType):
    id=graphene.ID()
    patient=graphene.Int(required=True)
    added_at=graphene.DateTime(required=True)
    description=graphene.String(required=True)
    media_urls=graphene.String(required=True)