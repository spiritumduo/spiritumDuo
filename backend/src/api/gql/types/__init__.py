from .patient import PatientObjectType 
from .pathway import PathwayObjectType
from .decisionpoint import DecisionPointObjectType
from .group import GroupObjectType
from .testresult import TestResultObjectType
from .user import UserObjectType
from .patientpathwayinstance import PatientPathwayInstanceObjectType
from .addpatientpayload import AddPatientPayloadObjectType
from .addpathwaypayload import AddPathwayPayloadObjectType

object_types_list=[
    PatientObjectType,
    PathwayObjectType,
    DecisionPointObjectType,
    GroupObjectType,
    TestResultObjectType,
    UserObjectType,
    PatientPathwayInstanceObjectType,
    AddPatientPayloadObjectType,
    AddPathwayPayloadObjectType,
]