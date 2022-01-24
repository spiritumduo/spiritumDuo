from starlette.applications import Starlette
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.sessions import SessionMiddleware
from models import db
from rest.api import _FastAPI
from authentication.authentication import SDAuthentication
from config import config
from gql.graphql import graphql
from containers import SDContainer


starlette_middleware = [
    Middleware(SessionMiddleware, secret_key=config['SESSION_SECRET_KEY'], session_cookie="SDSESSION", max_age=60*60*6),
    Middleware(AuthenticationMiddleware, backend=SDAuthentication()),
]

starlette_routes = [
    Route("/graphql", endpoint=graphql, methods=["POST", "GET"])
]

app = Starlette(debug=True, middleware=starlette_middleware, routes=starlette_routes)
app.mount("/rest", _FastAPI)
app.container = SDContainer()
db.init_app(app)
