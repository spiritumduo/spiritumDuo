import graphene

class PatientType(graphene.ObjectType):
    id=graphene.ID()
    hospitalNumber=graphene.String()
    nationalNumber=graphene.Int()
    communicationMethod=graphene.String()
    firstName=graphene.String()
    lastName=graphene.String()
    dateOfBirth=graphene.Date()
class _InputPatientType(graphene.InputObjectType):
    hospitalNumber=graphene.String(required=True)
    nationalNumber=graphene.Int(required=True)
    communicationMethod=graphene.String(required=True)
    firstName=graphene.String(required=True)
    lastName=graphene.String(required=True)
    dateOfBirth=graphene.Date(required=True)