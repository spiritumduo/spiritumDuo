import graphene

from .mutations import CreatePathway
from .queries import _PathwayQueries
from .types import PathwayType

class PathwayQueries(_PathwayQueries, graphene.ObjectType):
    pathways=graphene.List(PathwayType)
    pathway_search = graphene.Field(PathwayType, id=graphene.Int(), name=graphene.String())
    # this way we can keep it modular for permission decorators
    def resolve_pathways(root, info):
        return _PathwayQueries._resolve_pathways(root, info)
    def resolve_pathway_search(root, info, id, name):
        return _PathwayQueries._resolve_pathway_search(root, info, id, name)

class PathwayMutations(graphene.ObjectType):
    create_pathway=CreatePathway.Field()