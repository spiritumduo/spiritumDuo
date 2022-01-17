import inspect
import json
from functools import wraps
from typing import Callable
from starlette.authentication import has_required_scope, AuthenticationBackend, AuthCredentials
from starlette.requests import HTTPConnection
from starlette.responses import JSONResponse


class PseudoAuth(AuthenticationBackend):
    async def authenticate(self, request:HTTPConnection):
        if "Authorization" not in request.headers:
            if request['session']:
                return AuthCredentials(
                    scopes=["authenticated"]
                ), {}
            else:
                return AuthCredentials(scopes=[]), None


def needs_authentication(func: Callable) -> Callable:
    signature = inspect.signature(func)
    request_index = None
    for _, param in enumerate(signature.parameters.values()):
        if param.name == "request":
            request_index = _

    @wraps(func)
    async def wrapper(*args, **kwargs):
        if kwargs.get("request") is not None:
            request = kwargs.get("request")
        elif request_index is not None and args[request_index]:
            request = args[request_index]
        else:
            raise Exception("Request parameter not found in args or kwargs")

        if request is None:
            raise Exception("Request parameter not found")
        if not has_required_scope(request, ["authenticated"]):
            return JSONResponse(status_code=401)

        if inspect.iscoroutinefunction(func):
            return await func(*args, **kwargs)
        else:
            return func(*args, **kwargs)

    return wrapper
