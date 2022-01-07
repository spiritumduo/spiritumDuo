from starlette.config import environ
environ['TESTING'] = "True"

from models.db import db, TEST_DATABASE_URL
from api import app
from behave import fixture, use_fixture
from starlette.testclient import TestClient
from sqlalchemy_utils import database_exists, create_database, drop_database
from sqlalchemy import create_engine, MetaData


@fixture
def test_client(context):
    with TestClient(app) as client:
        context.client = client
        yield context.client


@fixture
async def db_transaction(context):
    print('tx')
    async with db.transaction() as tx:
        context.tx = tx
        yield context.tx
        tx.raise_rollback()

@fixture
def create_test_database(context):
    url = TEST_DATABASE_URL
    engine = create_engine(url)
    assert not database_exists(url)
    create_database(url)
    metadata = MetaData()
    metadata.create_all(engine)
    yield
    drop_database(url)


def before_feature(context, _):
    use_fixture(create_test_database, context)
    use_fixture(db_transaction, context)
    use_fixture(test_client, context)

