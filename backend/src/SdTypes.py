from enum import Enum, unique


@unique
class DecisionTypes(str, Enum):
    TRIAGE = "TRIAGE"
    CLINIC = "CLINIC"
    MDT = "MDT"
    AD_HOC = "AD_HOC"
    FOLLOW_UP = "FOLLOW_UP"
    POST_REQUEST = "POST_REQUEST"


@unique
class MilestoneState(str, Enum):
    INIT = "INIT"
    ACTIVE = "ACTIVE"
    WAITING = "WAITING"
    ERROR = "ERROR"
    COMPLETED = "COMPLETED"


@unique
class Sex(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"


@unique
class Permissions(str, Enum):
    # LOGGED IN USER
    AUTHENTICATED = "AUTHENTICATED"

    # DECISION OPERATIONS
    DECISION_CREATE = "DECISION_CREATE"
    DECISION_READ = "DECISION_READ"

    # MILESTONE OPERATIONS
    MILESTONE_CREATE = "MILESTONE_CREATE"
    MILESTONE_READ = "MILESTONE_READ"
    MILESTONE_UPDATE = "MILESTONE_UPDATE"

    # MILESTONE TYPE OPERATIONS
    MILESTONE_TYPE_READ = "MILESTONE_TYPE_READ"

    # ON PATHWAY OPERATIONS
    ON_PATHWAY_CREATE = "ON_PATHWAY_CREATE"
    ON_PATHWAY_READ = "ON_PATHWAY_READ"
    ON_PATHWAY_UPDATE = "ON_PATHWAY_UPDATE"

    # PATHWAY OPERATIONS
    PATHWAY_CREATE = "PATHWAY_CREATE"
    PATHWAY_READ = "PATHWAY_READ"
    PATHWAY_UPDATE = "PATHWAY_UPDATE"
    PATHWAY_DELETE = "PATHWAY_DELETE"

    # PATIENT OPERATIONS
    PATIENT_CREATE = "PATIENT_CREATE"
    PATIENT_READ = "PATIENT_READ"

    # ROLE OPERATIONS
    ROLE_CREATE = "ROLE_CREATE"
    ROLE_READ = "ROLE_READ"
    ROLE_UPDATE = "ROLE_UPDATE"
    ROLE_DELETE = "ROLE_DELETE"
    ROLE_PERMISSIONS_READ = "ROLE_PERMISSIONS_READ"

    # USER OPERATIONS
    USER_CREATE = "USER_CREATE"
    USER_READ = "USER_READ"
    USER_UPDATE = "USER_UPDATE"

    # MDT OPERATIONS
    MDT_CREATE = "MDT_CREATE"
    MDT_READ = "MDT_READ"
    MDT_UPDATE = "MDT_UPDATE"
    MDT_DELETE = "MDT_DELETE"

    # ONMDT OPERATIONS
    ON_MDT_CREATE = "ON_MDT_CREATE"
    ON_MDT_READ = "ON_MDT_READ"
    ON_MDT_UPDATE = "ON_MDT_UPDATE"
    ON_MDT_DELETE = "ON_MDT_DELETE"
