from typing import List
from dataloaders import OnMdtByIdLoader
from .pagination import make_connection, validate_parameters
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import OnMdt, Patient, MDT
from models.db import db
from .query_type import query


@query.field("getOnMdtConnection")
@needsAuthorization([Permissions.MDT_READ, Permissions.PATIENT_READ])
async def get_mdt_connection(
    obj=None, info: GraphQLResolveInfo = None, first=None,
    after=None, last=None, before=None, mdtId=None,
    patientId=None, pathwayId=None
):
    validate_parameters(first, after, last, before)

    if not mdtId and not (patientId and pathwayId):
        return None

    if mdtId:
        query: str = OnMdt.query.where(OnMdt.mdt_id == int(mdtId))
    else:
        query: str = Patient.join(OnMdt, Patient.id == OnMdt.patient_id)\
            .join(MDT, OnMdt.mdt_id == MDT.id).select()\
            .where(Patient.id == int(patientId))\
            .where(MDT.pathway_id == int(pathwayId))\
            .execution_options(loader=OnMdt)

    async with db.acquire(reuse=False) as conn:
        on_mdt_list: List[OnMdt] = await conn.all(query)
    for on_mdt in on_mdt_list:
        OnMdtByIdLoader.prime(on_mdt.id, on_mdt, context=info.context)

    return make_connection(on_mdt_list, before, after, first, last)
