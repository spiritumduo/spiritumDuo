from ariadne import gql
from .query_type import query
from api.dataloaders import PatientLoader

type_defs = gql(
    """
    extend type Query {
        getPatient(id: ID!): Patient
    }
"""
)

@query.field("getPatient")
async def resolve_get_patient(obj=None, info=None, id=None):
    patient=await PatientLoader.load_from_id(info.context, id)
    return patient or None