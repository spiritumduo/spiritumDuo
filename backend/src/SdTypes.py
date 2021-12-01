import enum


class DecisionTypes(enum.Enum):
    TRIAGE = "TRIAGE"
    CLINIC = "CLINIC"
    MDT = "MDT"
    AD_HOC = "AD_HOC"
    FOLLOW_UP = "FOLLOW_UP"