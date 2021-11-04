import graphene

class ConfigurationType(graphene.ObjectType):
    hospitalNumberName=graphene.String()
    hospitalNumberRegex=graphene.String()
    nationalPatientNumberName=graphene.String()
    nationalPatientNumberRegex=graphene.String()

class _InputConfigurationType(graphene.InputObjectType):
    hospitalNumberName=graphene.String()
    hospitalNumberRegex=graphene.String()
    nationalPatientNumberName=graphene.String()
    nationalPatientNumberRegex=graphene.String()