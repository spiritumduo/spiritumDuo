from fastapi import FastAPI
_FastAPI=FastAPI()

from .login import _FastAPI
from .logout import _FastAPI
from .createuser import _FastAPI
from .update_test_result import _FastAPI