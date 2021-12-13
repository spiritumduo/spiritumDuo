from starlette import requests
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.sessions import SessionMiddleware
from ariadne.asgi import GraphQL
from gql.schema import schema
from models import db
from randomdata import generate_random
from adduser import add_dev_user
from rest.api import _FastAPI
from authentication import SDAuthentication
from config import config

starlette_middleware = [
    Middleware(CORSMiddleware, allow_origins=[
        'https://studio.apollographql.com',
        'http://localhost:3000'
        ],
        allow_credentials=True,
        allow_methods=['*']
    ),
    Middleware(SessionMiddleware, secret_key=config['SESSION_SECRET_KEY'], session_cookie="SDSESSION", max_age=60*60*6),
    Middleware(AuthenticationMiddleware, backend=SDAuthentication()),
]
starlette_routes = [
    Route("/random", endpoint=generate_random),
    Route("/add-user", endpoint=add_dev_user)
]

def get_context_values(request:requests.HTTPConnection):
    return{
        "request":request,
        "db":db
    }

app=Starlette(debug=True, middleware=starlette_middleware, routes=starlette_routes)
db.init_app(app)
app.mount("/graphql", GraphQL(schema, debug=True, context_value=get_context_values))
app.mount("/rest", _FastAPI)