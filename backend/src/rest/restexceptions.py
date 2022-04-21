from starlette.exceptions import HTTPException


class UniqueViolationHTTPException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=409)


class NotFoundHTTPException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=404)
