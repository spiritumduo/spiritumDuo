import os
from gino_starlette import Gino

PG_URL = "postgresql://{user}:{password}@{host}:{port}/{database}".format(
    host=os.getenv("DATABASE_HOSTNAME", "localhost"),
    port=os.getenv("DATABASE_PORT", 5432),
    user=os.getenv("DATABASE_USERNAME", "postgres"),
    password=os.getenv("DATABASE_PASSWORD", ""),
    database=os.getenv("DATABASE_NAME", "postgres"),
)

db=Gino(
    dsn=PG_URL
)