import graphene

class ConfigurationType(graphene.ObjectType):
    id=graphene.ID()
    hospital_number_name=graphene.String(required=True)
    hospital_number_regex=graphene.String(required=True)
    national_patient_number_name=graphene.String(required=True)
    national_patient_number_regex=graphene.String(required=True)

class _InputConfigurationType(graphene.InputObjectType):
    hospital_number_name=graphene.String(required=True)
    hospital_number_regex=graphene.String(required=True)
    national_patient_number_name=graphene.String(required=True)
    national_patient_number_regex=graphene.String(required=True)