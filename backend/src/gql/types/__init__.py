from .patient import PatientObjectType
from .pathway import PathwayObjectType
from .user import UserObjectType
from .decisionpoint import DecisionPointObjectType
from .on_pathway import OnPathwayObjectType
from .decision_type import DecisionTypeEnumType
from .clinical_request import ClinicalRequestObjectType
from .clinical_request_state import ClinicalRequestStateEnum
from .test_result import TestResultObjectType
from .role_permission import RolePermissionObjectType
from .role import RoleObjectType
from .clinical_request_type import ClinicalRequestTypeType
from .mdt import MDTObjectType
from .on_mdt import OnMdtObjectType

object_types_list = [
    PatientObjectType,
    PathwayObjectType,
    UserObjectType,
    DecisionPointObjectType,
    OnPathwayObjectType,
    DecisionTypeEnumType,
    ClinicalRequestObjectType,
    ClinicalRequestStateEnum,
    TestResultObjectType,
    RolePermissionObjectType,
    RoleObjectType,
    ClinicalRequestTypeType,
    MDTObjectType,
    OnMdtObjectType,
]
