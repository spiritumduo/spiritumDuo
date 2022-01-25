from starlette.config import environ
environ['TESTING'] = "True"

import asyncio
from unittest.mock import AsyncMock
from bcrypt import hashpw, gensalt
from models.db import db, TEST_DATABASE_URL
from models import User, MilestoneType
from api import app
from behave import fixture, use_fixture
from starlette.testclient import TestClient
from sqlalchemy_utils import database_exists, create_database, drop_database
from trustadapter import TrustAdapter


@fixture
def create_test_client(context):
    with TestClient(app) as client:
        client.base_url="http://localhost:8080"
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
def add_test_data(context):
    loop = asyncio.get_event_loop()
    context.user = loop.run_until_complete(User.create(
        username=CLINICIAN['username'],
        password=hashpw(CLINICIAN["password"].encode('utf-8'), gensalt()).decode('utf-8'),
        first_name=CLINICIAN['firstName'],
        last_name=CLINICIAN['lastName'],
        department=CLINICIAN['department']
    ))
    context.milestone_one=loop.run_until_complete(MilestoneType.create(
        name="Test Milestone One",
        ref_name="test_milestone_one"
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

@fixture
def mock_trust_adapter(context):
    trust_adapter_mock = AsyncMock(spec=TrustAdapter)
    context.trust_adapter_mock = trust_adapter_mock
    with app.container.trust_adapter_client.override(trust_adapter_mock):
        yield


def before_feature(context, _):
    use_fixture(create_test_database, context)
    use_fixture(db_start_transaction, context)
    use_fixture(add_test_data, context)
    use_fixture(create_test_client, context)
    use_fixture(mock_trust_adapter, context)
    use_fixture(login_test_user, context)
