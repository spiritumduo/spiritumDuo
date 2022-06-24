from typing import List
from dataloaders import PatientByIdLoader
from .pagination import make_connection, validate_parameters
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import Patient, OnMdt
from models.db import db
from .query_type import query


@query.field("getPatientsOnMdtConnection")
@needsAuthorization([Permissions.MDT_READ, Permissions.PATIENT_READ])
async def get_mdt_connection(
    obj=None, info: GraphQLResolveInfo = None, first=None,
    after=None, last=None, before=None, id=None
):
    validate_parameters(first, after, last, before)

    async with db.acquire(reuse=False) as conn:
        patient_list: List[Patient] = await conn.all(
            Patient.join(OnMdt).select()
            .where(OnMdt.mdt_id == int(id))
            .execution_options(loader=Patient)
        )
    for patient in patient_list:
        PatientByIdLoader.prime(patient.id, patient, context=info.context)

    return make_connection(patient_list, before, after, first, last)
