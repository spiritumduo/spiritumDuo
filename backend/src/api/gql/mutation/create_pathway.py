from .mutation_type import mutation
from api.datacreation import CreatePathway

@mutation.field("createPathway")
async def resolve_create_pathway(_=None, into=None, input=None):
    return await CreatePathway(
        name=input["name"],
    )