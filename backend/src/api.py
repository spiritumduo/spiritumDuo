from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from ariadne.asgi import GraphQL
from gql.schema import schema
from models import db


middleware = [
    Middleware(CORSMiddleware, allow_origins=[
        'https://studio.apollographql.com',
        'http://localhost:3000'
        ],
        allow_credentials=True,
        allow_methods=['*']
    )
]

app=Starlette(debug=True, middleware=middleware)
db.init_app(app)
app.mount("/graphql", GraphQL(schema, debug=True, context_value={'db':db}))