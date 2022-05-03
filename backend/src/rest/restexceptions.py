from starlette.exceptions import HTTPException


class ConflictHTTPException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=409)


class NotFoundHTTPException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=404)


class UnprocessableHTTPException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=422)
