from ariadne import make_executable_schema, snake_case_fallback_resolvers

from .types import type_defs_list as data_type_defs_list, object_types_list
from .scalars import type_defs as scalar_type_defs, type_list as scalar_type_list
from .query import type_list as query_type_list, type_defs_list as query_type_defs_list
from .mutation import type_list as mutation_type_list, type_defs_list as mutation_type_defs_list


schema = make_executable_schema(
    [
        scalar_type_defs,           # one set of scalar type definitions
        *data_type_defs_list,       # many differnet data type definitions
        *query_type_defs_list,      # many different query type definitions
        *mutation_type_defs_list    # many different mutation type definitions
    ], 
    [
        *scalar_type_list,          # many different scalar types
        *query_type_list,           # many different query types
        *mutation_type_list         # many different mutation types
    ],
    *object_types_list,
    snake_case_fallback_resolvers   # this just makes returning data easier (snakecase+camelCase conversions)
)