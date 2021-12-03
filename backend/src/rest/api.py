from fastapi import FastAPI
_FastAPI=FastAPI()

from .login import _FastAPI
from .createuser import _FastAPI