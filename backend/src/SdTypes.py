import enum


class DecisionTypes(enum.Enum):
    TRIAGE = "TRIAGE"
    CLINIC = "CLINIC"
    MDT = "MDT"
    AD_HOC = "AD_HOC"
    FOLLOW_UP = "FOLLOW_UP"
    POST_REQUEST = "POST_REQUEST"


class MilestoneState(enum.Enum):
    INIT = "INIT"
    ACTIVE = "ACTIVE"
    WAITING = "WAITING"
    ERROR = "ERROR"
    COMPLETED = "COMPLETED"
