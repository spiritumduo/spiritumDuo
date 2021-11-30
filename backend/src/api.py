import os
from starlette.applications import Starlette
from ariadne.asgi import GraphQL
from gql.schema import schema
from gino_starlette import Gino
from models import *

PG_URL = "postgresql://{user}:{password}@{host}:{port}/{database}".format(
    host=os.getenv("DATABASE_HOSTNAME", "sd-postgres"),
    port=os.getenv("DATABASE_PORT", 5432),
    user=os.getenv("DATABASE_USERNAME", "postgres"),
    password=os.getenv("DATABASE_PASSWORD", "postgres"),
    database=os.getenv("DATABASE_NAME", "starlette"),
)

app=Starlette(debug=True)
app.mount("/graphql", GraphQL(schema, debug=True))

db=Gino(app, dsn=PG_URL)

