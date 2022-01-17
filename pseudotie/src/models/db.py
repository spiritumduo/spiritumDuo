import os
from gino_starlette import Gino

DB_STR = "postgresql://{user}:{password}@{host}:{port}/{database}"

DATABASE_URL = DB_STR.format(
    host=os.getenv("DATABASE_HOSTNAME"),
    port=os.getenv("DATABASE_PORT"),
    user=os.getenv("DATABASE_USERNAME"),
    password=os.getenv("DATABASE_PASSWORD"),
    database=os.getenv("DATABASE_NAME"),
)

db = Gino(dsn=DATABASE_URL)
