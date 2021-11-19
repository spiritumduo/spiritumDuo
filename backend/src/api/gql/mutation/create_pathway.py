from ariadne import gql
from .mutation_type import mutation
from api.datacreation import CreatePathway

type_defs=gql(
    """
        extend type Mutation{
            createPathway(input:CreatePathwayInput): Pathway!
        }
        input CreatePathwayInput{
            name:String!
        }
    """
)

@mutation.field("createPathway")
async def resolve_create_pathway(_=None, into=None, input=None):
    return await CreatePathway(
        name=input["name"],
    )