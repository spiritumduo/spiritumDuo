import graphene
from api.dao.ConfigurationDAO import ConfigurationDAO
from .types import ConfigurationType, _InputConfigurationType

class createConfiguration(graphene.Mutation):
    data=graphene.Field(ConfigurationType)
    class Arguments:
        input=graphene.Argument(_InputConfigurationType)
    def mutate(self, info, input):
        newConfiguration=ConfigurationDAO(
            hospital_number_name=input.hospital_number_name,
            hospital_number_regex=input.hospital_number_regex,
            national_patient_number_name=input.national_patient_number_name,
            national_patient_number_regex=input.national_patient_number_regex,
        )
        newConfiguration.save()
        return createConfiguration(data=newConfiguration)