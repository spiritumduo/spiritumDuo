from .mutation_type import mutation
from .mutation_type import type_defs as mutation_type_defs

from .create_patient import type_defs as create_patient_type_defs
from .create_configuration import type_defs as create_configuration_type_defs
type_defs_list=[
    mutation_type_defs,
    create_patient_type_defs,
    create_configuration_type_defs
]
type_list=[mutation]