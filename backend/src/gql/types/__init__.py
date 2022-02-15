from .patient import PatientObjectType
from .pathway import PathwayObjectType
from .user import UserObjectType
from .decisionpoint import DecisionPointObjectType
from .on_pathway import OnPathwayObjectType
from .decision_type import DecisionTypeEnumType
from .add_patient_payload import AddPatientPayloadObjectType
from .add_pathway_payload import AddPathwayPayloadObjectType
from .add_decision_point_type import AddDecisionPointPayloadObjectType
from .milestone import MilestoneObjectType
from .milestone_state import MilestoneStateEnum
from .test_result import TestResultObjectType
from .import_milestone_payload import ImportMilestonePayloadObjectType

object_types_list=[
    PatientObjectType,
    PathwayObjectType,
    UserObjectType,
    DecisionPointObjectType,
    OnPathwayObjectType,
    DecisionTypeEnumType,
    AddPatientPayloadObjectType,
    AddPathwayPayloadObjectType,
    AddDecisionPointPayloadObjectType,
    MilestoneObjectType,
    MilestoneStateEnum,
    TestResultObjectType,
    ImportMilestonePayloadObjectType
]