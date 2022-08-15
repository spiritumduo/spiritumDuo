from dataclasses import dataclass
from typing import List, Optional, Union
from models import DecisionPoint, MDT, Pathway, Patient, Role, OnMdt, OnPathway


# TODO: remove this
class ReferencedItemDoesNotExistError(Exception):
    """
    This occurs when a referenced item does not
    exist and cannot be found when it should
    """


class PatientNotInIntegrationEngineError(Exception):
    """
    This is raised when a patient cannot be found
    via the integration engine
    """


class MutationUserErrorHandler:
    """
    Stores user errors for data creators where user
    input is taken, or possible user errors occur
    """

    def __init__(self):
        self.errorList: List[BaseMutationPayload] = []

    def addError(self, field: str = None, message: str = None):
        self.errorList.append(MutationUserError(field=field, message=message))
        return self

    def hasErrors(self):
        return len(self.errorList) > 0


class UserDoesNotHavePathwayPermission(Exception):
    """
    Raised when a user attempts an operation
    on a pathway they should not have access to
    """


@dataclass
class SafeUser:
    """
    This is the the user object with no password field.
    Safe to return to users
    """
    id: int = None,
    username: str = None,
    email: str = None,
    first_name: str = None,
    last_name: str = None,
    department: str = None,
    default_pathway_id: int = None,
    is_active: bool = None


@dataclass
class MutationUserError:
    field: str
    message: str


@dataclass
class BaseMutationPayload:
    user_errors: Optional[List[MutationUserError]] = None


@dataclass
class DecisionPointPayload(BaseMutationPayload):
    decision_point: Optional[DecisionPoint] = None


@dataclass
class MdtPayload(BaseMutationPayload):
    mdt: Union[MDT, None] = None


@dataclass
class PathwayPayload(BaseMutationPayload):
    pathway: Union[Pathway, None] = None


@dataclass
class PatientPayload(BaseMutationPayload):
    patient: Union[Patient, None] = None


@dataclass
class RolePayload(BaseMutationPayload):
    role: Union[Role, None] = None


@dataclass
class UserPayload(BaseMutationPayload):
    user: Union[SafeUser, None] = None


@dataclass
class OnMdtPayload(BaseMutationPayload):
    on_mdt: Union[OnMdt, None] = None


@dataclass
class DeletePayload(BaseMutationPayload):
    success: Union[bool, None] = None


@dataclass
class OnPathwayPayload(BaseMutationPayload):
    on_pathway: Union[OnPathway, None] = None
