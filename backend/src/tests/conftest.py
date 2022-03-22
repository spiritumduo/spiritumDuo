from httpx import AsyncClient
import pytest
import pytest_asyncio
from starlette.config import environ
from unittest.mock import AsyncMock
from bcrypt import hashpw, gensalt
from models.db import db, TEST_DATABASE_URL
from models import User, Pathway, MilestoneType
from random import randint
from api import app
from sqlalchemy_utils import database_exists, create_database, drop_database
from trustadapter import TrustAdapter

environ['TESTING'] = "True"


class ContextStorage:
    """
    Used to hold functions and data between
    test cases
    """


@pytest.fixture
async def create_test_client():
    async with AsyncClient(
        app=app, base_url="http://localhost:8080"
    ) as client:
        ContextStorage.client = client
        yield


@pytest_asyncio.fixture
async def db_start_transaction():
    ContextStorage.conn = await ContextStorage.engine.acquire()
    ContextStorage.tx = await ContextStorage.conn.transaction()
    yield
    await ContextStorage.tx.rollback()


@pytest_asyncio.fixture
async def create_test_database():
    if database_exists(TEST_DATABASE_URL):
        drop_database(TEST_DATABASE_URL)
    # assert not database_exists(TEST_DATABASE_URL)
    create_database(TEST_DATABASE_URL)
    ContextStorage.engine = await db.set_bind(TEST_DATABASE_URL)
    await db.gino.create_all()
    yield
    drop_database(TEST_DATABASE_URL)


@pytest_asyncio.fixture
async def create_test_data():
    ContextStorage.PATHWAY = await Pathway.create(
        name=f"BRONCHIECTASIS{randint(1000,9999)}",
    )
    ContextStorage.USER_INFO = {
        "username": "testUser",
        "password": "testPassword"
    }
    ContextStorage.USER = await User.create(
        username=ContextStorage.USER_INFO['username'],
        password=hashpw(
            ContextStorage.USER_INFO['password'].encode('utf-8'),
            gensalt()
        ).decode('utf-8'),
        first_name="Test",
        last_name="User",
        department="Test Department",
        default_pathway_id=ContextStorage.PATHWAY.id,
    )

    ContextStorage.MILESTONE_TYPE = await MilestoneType.create(
        name="Test Milestone",
        ref_name="ref_test_milestone",
        is_checkbox_hidden=True,
    )
    yield


@pytest_asyncio.fixture
async def login_user():
    ContextStorage.LOGGED_IN_USER = await ContextStorage.client.post(
        url='/rest/login/',
        json=ContextStorage.USER_INFO
    )


@pytest_asyncio.fixture
async def mock_trust_adapter():
    trust_adapter_mock = AsyncMock(spec=TrustAdapter)
    ContextStorage.trust_adapter_mock = trust_adapter_mock
    with app.container.trust_adapter_client.override(trust_adapter_mock):
        yield


@pytest_asyncio.fixture(scope="function")
async def context(
    create_test_database,
    create_test_client,
    db_start_transaction,
    mock_trust_adapter,
    create_test_data,
    login_user
):
    yield ContextStorage
