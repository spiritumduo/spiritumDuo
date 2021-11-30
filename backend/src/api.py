from starlette.applications import Starlette
from ariadne.asgi import GraphQL
from gql.schema import schema

app=Starlette(debug=True)
app.mount("/graphql", GraphQL(schema, debug=True))