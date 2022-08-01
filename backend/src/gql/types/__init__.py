from .patient import PatientObjectType
from .pathway import PathwayObjectType
from .user import UserObjectType
from .decisionpoint import DecisionPointObjectType
from .on_pathway import OnPathwayObjectType
from .decision_type import DecisionTypeEnumType
from .add_patient_payload import AddPatientPayloadObjectType
from .add_pathway_payload import AddPathwayPayloadObjectType
from .add_decision_point_type import AddDecisionPointPayloadObjectType
from .clinical_request import ClinicalRequestObjectType
from .clinical_request_state import ClinicalRequestStateEnum
from .test_result import TestResultObjectType
from .lock_on_pathway_payload import LockOnPathwayPayloadObjectType
from .role_permission import RolePermissionObjectType
from .role import RoleObjectType
from .clinical_request_type import ClinicalRequestTypeType
from .delete_payload import DeletePayloadObjectType
from .mdt_payload import MdtPayloadObjectType
from .mdt import MDTObjectType
from .on_mdt import OnMdtObjectType
from .on_mdt_payload import OnMdtPayloadObjectType

object_types_list = [
    PatientObjectType,
    PathwayObjectType,
    UserObjectType,
    DecisionPointObjectType,
    OnPathwayObjectType,
    DecisionTypeEnumType,
    AddPatientPayloadObjectType,
    AddPathwayPayloadObjectType,
    AddDecisionPointPayloadObjectType,
    ClinicalRequestObjectType,
    ClinicalRequestStateEnum,
    TestResultObjectType,
    LockOnPathwayPayloadObjectType,
    RolePermissionObjectType,
    RoleObjectType,
    ClinicalRequestTypeType,
    DeletePayloadObjectType,
    MdtPayloadObjectType,
    MDTObjectType,
    OnMdtObjectType,
    OnMdtPayloadObjectType,
]
