import graphene

from .mutations import CreatePathway
from .queries import _PathwayQueries
from .types import PathwayType, PathwayTypeConnection
from ..patient.types import PatientType, PatientTypeConnection

class PathwayQueries(_PathwayQueries, graphene.ObjectType):
    pathways=graphene.List(PathwayType)
    pathway_search = graphene.Field(PathwayType, id=graphene.Int(), name=graphene.String())
    # get_patient_pathways=graphene.List(PathwayType, patientId=graphene.Int())
    # get_pathway_patients=graphene.List(PatientType, pathwayId=graphene.Int())
    get_patient_pathways=graphene.relay.ConnectionField(PathwayTypeConnection, patientId=graphene.Int())
    get_patients_for_pathway=graphene.relay.ConnectionField(PatientTypeConnection, pathwayId=graphene.Int())
    # this way we can keep it modular for permission decorators

    def resolve_pathways(root, info):
        return _PathwayQueries._resolve_pathways(root, info)

    def resolve_pathway_search(root, info, id, name):
        return _PathwayQueries._resolve_pathway_search(root, info, id, name)

    def resolve_get_patient_pathways(root, info, patientId):
        return _PathwayQueries._resolve_patient_pathways(root, info, patientId)

    def resolve_get_patients_for_pathway(root, info, pathwayId):
        return _PathwayQueries._resolve_patients_for_pathway(root, info, pathwayId)

class PathwayMutations(graphene.ObjectType):
    create_pathway=CreatePathway.Field()