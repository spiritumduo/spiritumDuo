import graphene

class PatientType(graphene.ObjectType):
    id=graphene.ID()
    hospital_number=graphene.String()
    national_number=graphene.Int()
    communication_method=graphene.String()
    first_name=graphene.String()
    last_name=graphene.String()
    date_of_birth=graphene.Date()
class _InputPatientType(graphene.InputObjectType):
    id=graphene.ID()
    hospital_number=graphene.String(required=True)
    national_number=graphene.Int(required=True)
    communication_method=graphene.String(required=True)
    first_name=graphene.String(required=True)
    last_name=graphene.String(required=True)
    date_of_birth=graphene.Date(required=True)