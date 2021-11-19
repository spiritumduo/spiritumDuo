from .patient import type_defs as patient_type_defs
from .configuration import type_defs as configuration_type_defs
from .pathway import type_defs as pathway_type_defs
from .decisionpoint import type_defs as dp_type_defs
from .role import type_defs as role__type_defs
from .testresult import type_defs as tr_type_defs
from .user import type_defs as user_type_defs, UserObjectType
from .patientpathwayinstances import type_defs as pt_pw_insnc_type_defs

type_defs_list=[
    patient_type_defs,
    configuration_type_defs,
    pathway_type_defs,
    dp_type_defs,
    role__type_defs,
    tr_type_defs,
    user_type_defs,
    pt_pw_insnc_type_defs
]

object_types_list=[
    UserObjectType
]