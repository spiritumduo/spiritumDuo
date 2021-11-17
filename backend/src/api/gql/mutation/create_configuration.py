from ariadne import gql
from .mutation_type import mutation
from api.datacreation import CreateConfiguration

type_defs=gql(
    """
        extend type Mutation{
            createConfiguration(input:CreateConfigurationInput): Configuration!
        }
        input CreateConfigurationInput{
            hospitalNumberName:String!
            hospitalNumberRegex:String!
            nationalPatientNumberName:String!
            nationalPatientNumberRegex:String!
        }
    """
)

@mutation.field("createConfiguration")
async def resolve_create_configuration(_=None, into=None, input=None):
    return await CreateConfiguration(
        hospital_number_name=input["hospitalNumberName"],
        hospital_number_regex=input["hospitalNumberRegex"],
        national_patient_number_name=input["nationalPatientNumberName"],
        national_patient_number_regex=input["nationalPatientNumberRegex"],
    )