from datacreators import CreateMDT
from .mutation_type import mutation
from models import MDT
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions


@mutation.field("createMdt")
@needsAuthorization([Permissions.MDT_CREATE])
async def resolve_create_decision(
    obj=None, info: GraphQLResolveInfo = None, input: dict = None
) -> MDT:
    return await CreateMDT(
        context=info.context,
        plannedAt=input['plannedAt'],
        pathwayId=input['pathwayId'],
        location=input['location']
    )
