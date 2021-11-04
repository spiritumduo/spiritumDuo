import graphene

from .mutations import CreateRole
from .queries import _RoleQueries
from .types import RoleType

class RoleQueries(_RoleQueries, graphene.ObjectType):
    roles=graphene.List(RoleType)
    role_search = graphene.Field(RoleType, searchParam=graphene.String())
    # this way we can keep it modular for permission decorators
    def resolve_roles(root, info):
        return _RoleQueries._resolve_roles(root, info)
    def resolve_role_search(root, info, searchParam):
        return _RoleQueries._resolve_role_search(root, info, searchParam)

class RoleMutations(graphene.ObjectType):
    create_role=CreateRole.Field()