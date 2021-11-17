from ariadne import gql
from .mutation_type import mutation
from api.datacreation import CreatePatient

type_defs=gql(
    """
        extend type Mutation{
            createPatient(input:CreatePatientInput): Patient!
        }
        input CreatePatientInput{
            firstName:String!
            lastName:String!
            communicationMethod:String!
            hospitalNumber:Int!
            nationalNumber:Int!
            dateOfBirth:Date!
        }
    """
)

@mutation.field("createPatient")
async def resolve_create_patient(_=None, into=None, input=None):
    return await CreatePatient(
        first_name=input["firstName"],
        last_name=input["lastName"],
        communication_method=input["communicationMethod"],
        hospital_number=input["hospitalNumber"],
        national_number=input["nationalNumber"],
        date_of_birth=input["dateOfBirth"],
    )