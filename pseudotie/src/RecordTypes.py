import enum


class TestResultState(enum.Enum):
    INIT = "INIT"
    ACTIVE = "ACTIVE"
    WAITING = "WAITING"
    ERROR = "ERROR"
    COMPLETED = "COMPLETED"


class Sex(enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
