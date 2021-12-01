from starlette.applications import Starlette
from ariadne.asgi import GraphQL
from gql.schema import schema
from models import db

app=Starlette(debug=True)
app.mount("/graphql", GraphQL(schema, debug=True))

db.init_app(app)
