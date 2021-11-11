import graphene

from .mutations import CreatePathway
from .queries import _PathwayQueries
from .types import PathwayType, PathwayTypeConnection
from ..patient.types import PatientTypeConnection

class PathwayQueries(_PathwayQueries, graphene.ObjectType):
    get_pathways=graphene.List(PathwayType)
    get_pathway_search=graphene.Field(PathwayType, id=graphene.Int(), name=graphene.String())
    get_pathways_for_patient=graphene.relay.ConnectionField(PathwayTypeConnection, patientId=graphene.Int())
    get_patients_for_pathway=graphene.relay.ConnectionField(PatientTypeConnection, pathwayId=graphene.Int())
    # this way we can keep it modular for permission decorators

    def resolve_get_pathways(root, info):
        return _PathwayQueries._resolve_pathways(root, info)
    def resolve_get_pathway_search(root, info, id=None, name=None):
        return _PathwayQueries._resolve_pathway_search(root, info, id, name)
    def resolve_get_pathways_for_patient(root, info, patientId=None):
        return _PathwayQueries._resolve_pathways_for_patient(root, info, patientId)
    def resolve_get_patients_for_pathway(root, info, pathwayId=None):
        return _PathwayQueries._resolve_patients_for_pathway(root, info, pathwayId)

class PathwayMutations(graphene.ObjectType):
    create_pathway=CreatePathway.Field()