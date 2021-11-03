import graphene
from api.dao.ConfigurationDAO import ConfigurationDAO
from .types import ConfigurationType, _InputConfigurationType

class CreateConfiguration(graphene.Mutation):
    configuration=graphene.Field(ConfigurationType)
    class Arguments:
        configurationInput=graphene.Argument(_InputConfigurationType)
    def mutate(self, info, configurationInput):
        newConfiguration=ConfigurationDAO(
            hospitalNumberName=configurationInput.hospitalNumberName,
            hospitalNumberRegex=configurationInput.hospitalNumberRegex,
            nationalPatientNumberName=configurationInput.nationalPatientNumberName,
            nationalPatientNumberRegex=configurationInput.nationalPatientNumberRegex,
        )
        return CreateConfiguration(configuration=newConfiguration.save())