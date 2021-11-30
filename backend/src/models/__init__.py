import os
from gino_starlette import Gino

PG_URL = "postgresql://{user}:{password}@{host}:{port}/{database}".format(
    host=os.getenv("DATABASE_HOSTNAME", "sd-postgres"),
    port=os.getenv("DATABASE_PORT", 5432),
    user=os.getenv("DATABASE_USERNAME", "postgres"),
    password=os.getenv("DATABASE_PASSWORD", "postgres"),
    database=os.getenv("DATABASE_NAME", "starlette"),
)

db=Gino(
    dsn=PG_URL
)