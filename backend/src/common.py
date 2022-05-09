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


class DataCreatorInputErrors:
    """
    Stores user errors for data creators where user
    input is taken, or possible user errors occur
    """

    def __init__(self):
        self.errorList = []

    def addError(self, field: str = None, message: str = None):
        self.errorList.append({"field": field, "message": message})
        return self

    def hasErrors(self):
        return len(self.errorList) > 0


class UserDoesNotHavePathwayPermission(Exception):
    """
    Raised when a user attempts an operation
    on a pathway they should not have access to
    """
