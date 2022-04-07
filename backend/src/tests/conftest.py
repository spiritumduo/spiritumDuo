# It's very important this happens first
from starlette.config import environ
environ['TESTING'] = "True"

import asyncio
from gino import GinoConnection
import dataclasses
from async_asgi_testclient import TestClient
from gino_starlette import Gino
from httpx import AsyncClient
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock
from bcrypt import hashpw, gensalt
from models.db import db, TEST_DATABASE_URL
from models import User, Pathway, MilestoneType
from api import app
from sqlalchemy_utils import database_exists, create_database, drop_database
from trustadapter import TrustAdapter


class ContextStorage:
    """
    Used to hold functions and data between
    test cases
    """


@pytest.fixture
async def httpx_test_client():
    async with AsyncClient(
        app=app, base_url="http://localhost:8080"
    ) as client:
        yield client


@pytest.fixture
def test_client():
    client = TestClient(app)
    yield client


@pytest.fixture
async def create_test_database(event_loop) -> Gino:
    if database_exists(TEST_DATABASE_URL):
        drop_database(TEST_DATABASE_URL)
    create_database(TEST_DATABASE_URL)
    engine = await db.set_bind(TEST_DATABASE_URL)
    await db.gino.create_all()
    yield engine
    drop_database(TEST_DATABASE_URL)


@pytest.fixture(autouse=True)
async def db_start_transaction(create_test_database):
    engine = create_test_database
    conn: GinoConnection = await engine.acquire()
    tx = await conn.transaction()
    yield [conn, tx]
    await tx.rollback()
    await conn.release()


@pytest.fixture
async def test_pathway() -> Pathway:
    return await Pathway.create(
        name="BRONCHIECTASIS",
    )


@pytest.fixture
async def test_milestone_type() -> MilestoneType:
    return await MilestoneType.create(
        name="Test Milestone",
        ref_name="ref_test_milestone",
        is_checkbox_hidden=True,
    )


@dataclasses.dataclass
class UserFixture:
    user: User
    password: str


@pytest.fixture
async def test_user(test_pathway, db_start_transaction) -> UserFixture:
    user_info = {
        "username": "testUser",
        "password": "testPassword"
    }
    pathway = test_pathway
    user = await User.create(
        username=user_info['username'],
        password=hashpw(
            user_info['password'].encode('utf-8'),
            gensalt()
        ).decode('utf-8'),
        first_name="Test",
        last_name="User",
        department="Test Department",
        default_pathway_id=pathway.id,
    )
    return UserFixture(
        user=user,
        password=user_info['password']
    )

@pytest.fixture
async def login_user(test_user: UserFixture, httpx_test_client):
    client = httpx_test_client
    user_fixture = test_user
    res = await client.post(
        url='/rest/login/',
        json={
            "username": user_fixture.user.username,
            "password": user_fixture.password,
        }
    )
    yield res


@pytest.fixture
async def mock_trust_adapter():
    trust_adapter_mock = AsyncMock(spec=TrustAdapter)
    trust_adapter_mock = trust_adapter_mock
    with app.container.trust_adapter_client.override(trust_adapter_mock):
        yield trust_adapter_mock


@pytest_asyncio.fixture(scope="function")
async def context(
    create_test_database,
    httpx_test_client,
    db_start_transaction,
    mock_trust_adapter,
    test_pathway,
    test_user,
    test_milestone_type,
    login_user
):
    # At least now this construction is now done here, rather than being scattered across this module
    cs = ContextStorage()
    cs.engine = create_test_database
    cs.client = httpx_test_client
    conn, tx = db_start_transaction
    cs.conn = conn
    cs.tx = tx
    cs.trust_adapter_mock = mock_trust_adapter
    cs.PATHWAY = test_pathway
    user_fixture = test_user
    cs.USER = user_fixture.user
    cs.USER_INFO = {
        "username": user_fixture.user.username,
        "password": user_fixture.password
    }
    cs.MILESTONE_TYPE = test_milestone_type
    cs.LOGGED_IN_USER = login_user
    yield cs
