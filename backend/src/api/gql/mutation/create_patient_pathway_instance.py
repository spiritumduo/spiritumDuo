from ariadne import gql
from .mutation_type import mutation
from api.datacreation import CreatePatientPathwayInstance

type_defs=gql(
    """
        extend type Mutation{
            createPatientPathwayInstance(input:CreatePtPwInstanceInput): PatientPathwayInstances!
        }
        input CreatePtPwInstanceInput{
            patient:Int!
            pathway:Int!
            isDischarged:Boolean!
            awaitingDecisionType:String!
        }
    """
)

@mutation.field("createPatientPathwayInstance")
async def resolve_create_patient_pathway_instance(_=None, info=None, input=None):
    return await CreatePatientPathwayInstance(
        patient=input["patient"],
        pathway=input["pathway"],
        is_discharged=input["isDischarged"],
        awaiting_decision_type=input["awaitingDecisionType"],
        context=info.context
    )