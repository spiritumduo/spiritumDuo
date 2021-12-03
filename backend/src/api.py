from starlette.applications import Starlette
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from ariadne.asgi import GraphQL
from gql.schema import schema
from models import db
from randomdata import generate_random
from rest.api import _FastAPI
middleware = [
    Middleware(CORSMiddleware, allow_origins=[
        'https://studio.apollographql.com',
        'http://localhost:3000'
        ],
        allow_credentials=True,
        allow_methods=['*']
    )
]

starlette_routes = [
    Route("/random", endpoint=generate_random)
]

app=Starlette(debug=True, middleware=middleware, routes=starlette_routes)
db.init_app(app)
app.mount("/graphql", GraphQL(schema, debug=True, context_value={'db':db}))
app.mount("/rest", _FastAPI)