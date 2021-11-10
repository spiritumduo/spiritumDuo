import graphene

from .mutations import CreateRole
from .queries import _RoleQueries
from .types import RoleType

class RoleQueries(_RoleQueries, graphene.ObjectType):
    get_roles=graphene.List(RoleType)
    get_role_by_search = graphene.Field(RoleType, id=graphene.Int(), name=graphene.String())
    # this way we can keep it modular for permission decorators
    def resolve_get_roles(root, info):
        return _RoleQueries._resolve_get_roles(root, info)
    def resolve_get_role_by_search(root, info, id, name):
        return _RoleQueries._resolve_get_role_by_search(root, info, id, name)

class RoleMutations(graphene.ObjectType):
    create_role=CreateRole.Field()