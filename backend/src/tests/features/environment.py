import asyncio
from random import randint

from bcrypt import hashpw, gensalt
from behave.api.async_step import async_run_until_complete
from starlette.config import environ
environ['TESTING'] = "True"

from models.db import db, TEST_DATABASE_URL
from models import User
from api import app
from behave import fixture, use_fixture
from starlette.testclient import TestClient
from sqlalchemy_utils import database_exists, create_database, drop_database


@fixture
def create_test_client(context):
    with TestClient(app) as client:
        context.client = client
        yield context.client


@fixture
def db_start_transaction(context):
    loop = asyncio.get_event_loop()
    conn = loop.run_until_complete(context.engine.acquire())
    tx = loop.run_until_complete(conn.transaction())
    context.conn = conn
    context.tx = tx
    yield
    loop.run_until_complete(context.tx.rollback())


@fixture
def create_test_database(context):
    url = TEST_DATABASE_URL
    assert not database_exists(url)
    create_database(url)
    loop = asyncio.get_event_loop()
    context.engine = loop.run_until_complete(db.set_bind(TEST_DATABASE_URL))
    loop.run_until_complete(db.gino.create_all())
    yield
    drop_database(url)


CLINICIAN = {
    "firstName": "MIKE",
    "lastName": "SMITH",
    "username": "MIKE.SMITH",
    "password": "VERYSECUREPASSWORD",
    "department": "CIH",
}


@fixture
def add_test_user(context):
    loop = asyncio.get_event_loop()
    context.user = loop.run_until_complete(User.create(
        username=CLINICIAN['username'],
        password=hashpw(CLINICIAN["password"].encode('utf-8'), gensalt()).decode('utf-8'),
        first_name=CLINICIAN['firstName'],
        last_name=CLINICIAN['lastName'],
        department=CLINICIAN['department']
    ))


@fixture
def login_test_user(context):
    res = context.client.post(
        url='/rest/login/',
        json={
            "username": CLINICIAN['username'],
            "password": CLINICIAN['password']
        }
    )


def before_feature(context, _):
    use_fixture(create_test_database, context)
    use_fixture(db_start_transaction, context)
    use_fixture(add_test_user, context)
    use_fixture(create_test_client, context)
    use_fixture(login_test_user, context)

