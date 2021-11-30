from ariadne import make_executable_schema, load_schema_from_path, snake_case_fallback_resolvers

from .types import object_types_list
from .scalars import type_list as scalar_type_list
from .query import type_list as query_type_list
from .mutation import type_list as mutation_type_list


schema = make_executable_schema(
    load_schema_from_path("api/gql/schema.graphql"),
    [
        *scalar_type_list,          # many different scalar types
        *query_type_list,           # many different query types
        *mutation_type_list         # many different mutation types
    ],
    *object_types_list,
    snake_case_fallback_resolvers
)