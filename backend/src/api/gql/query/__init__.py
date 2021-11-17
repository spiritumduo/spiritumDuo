from .query_type import query
from .query_type import type_defs as query_type_defs

from .get_patient import type_defs as get_patient_type_defs
from .get_configuration import type_defs as get_configuration_type_defs
type_defs_list=[
    query_type_defs,
    get_patient_type_defs,
    get_configuration_type_defs
]
type_list=[query]