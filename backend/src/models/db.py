import os
from gino_starlette import Gino
from starlette.config import environ

DB_STR = "postgresql://{user}:{password}@{host}:{port}/{database}"

TESTING = environ.get("TESTING", False)
DATABASE_URL = DB_STR.format(
    host=os.getenv("DATABASE_HOSTNAME"),
    port=os.getenv("DATABASE_PORT"),
    user=os.getenv("DATABASE_USERNAME"),
    password=os.getenv("DATABASE_PASSWORD"),
    database=os.getenv("DATABASE_NAME"),
)

# The database has 'test_' prepended here
TEST_DATABASE_URL = DB_STR.format(
    host=os.getenv("DATABASE_HOSTNAME"),
    port=os.getenv("DATABASE_PORT"),
    user=os.getenv("DATABASE_USERNAME"),
    password=os.getenv("DATABASE_PASSWORD"),
    database="test_" + os.getenv("DATABASE_NAME"),
)

if TESTING:
    db = Gino(
        dsn=TEST_DATABASE_URL,
        pool_max_size=25,
        pool_min_size=10,
    )
else:
    db = Gino(dsn=DATABASE_URL)
