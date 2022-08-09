# It's very important this happens first
import datetime
from starlette.config import environ
environ['TESTING'] = "True"

from typing import List
from SdTypes import ClinicalRequestState, Permissions
from sdpubsub import SdPubSub
from gino import GinoConnection
import dataclasses
from async_asgi_testclient import TestClient
from gino_starlette import Gino
from httpx import AsyncClient, Response
import pytest
from unittest.mock import AsyncMock
from bcrypt import hashpw, gensalt
from models.db import db, TEST_DATABASE_URL
from models import (
    User,
    Pathway,
    ClinicalRequestType,
    Role,
    UserRole,
    RolePermission,
    Patient,
    OnPathway,
    PathwayClinicalRequestType,
    UserPathway,
    MDT,
    OnMdt,
    ClinicalRequest
)
from api import app
from sqlalchemy_utils import database_exists, create_database, drop_database
from trustadapter import TrustAdapter
from email_adapter import EmailAdapter


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


@pytest.fixture(autouse=True)
async def create_test_database() -> Gino:
    if database_exists(TEST_DATABASE_URL):
        drop_database(TEST_DATABASE_URL)
    create_database(TEST_DATABASE_URL)
    engine = await db.set_bind(TEST_DATABASE_URL)
    await db.gino.create_all()
    yield engine
    drop_database(TEST_DATABASE_URL)


@pytest.fixture
async def db_start_transaction(create_test_database):
    engine = create_test_database
    conn: GinoConnection = await engine.acquire()
    tx = await conn.transaction()
    yield [conn, tx]
    await tx.rollback()
    await conn.release()


@pytest.fixture(scope="function")
async def test_pathway(db_start_transaction) -> Pathway:
    return await Pathway.create(
        name="BRONCHIECTASIS",
    )


@pytest.fixture
async def test_clinical_request_type(
    db_start_transaction,
    test_pathway
) -> ClinicalRequestType:
    mT: ClinicalRequestType = await ClinicalRequestType.create(
        name="Test ClinicalRequest",
        ref_name="ref_test_clinical_request",
        is_checkbox_hidden=True,
    )

    await PathwayClinicalRequestType.create(
        pathway_id=test_pathway.id,
        clinical_request_type_id=mT.id
    )

    return mT


@pytest.fixture
async def test_role(db_start_transaction) -> Role:
    return await Role.create(name="test-role")


@pytest.fixture
async def test_patients(db_start_transaction) -> List[Patient]:
    patients = []
    for i in range(1, 11):
        p = await Patient.create(
            hospital_number=f"fake-hospital-number-{i}",
            national_number=f"fake-national-number-{i}",
        )
        patients.append(p)
    return patients


@pytest.fixture
async def test_patients_on_pathway(
    test_patients: List[Patient],
    test_pathway: Pathway,
    db_start_transaction
) -> List[OnPathway]:
    on_pathway_list = []
    for p in test_patients:
        on_pathway_list.append(
            await OnPathway.create(
                patient_id=p.id,
                pathway_id=test_pathway.id,
            )
        )
    return on_pathway_list


@dataclasses.dataclass
class UserFixture:
    user: User
    password: str
    role: Role


@pytest.fixture
async def test_user(
    test_pathway: Pathway,
    db_start_transaction,
    test_role: Role
) -> UserFixture:
    user_info = {
        "username": "testuser",
        "password": "testPassword"
    }
    pathway = test_pathway
    user = await User.create(
        username=user_info['username'],
        password=hashpw(
            user_info['password'].encode('utf-8'),
            gensalt()
        ).decode('utf-8'),
        email="test@test.test",
        first_name="Test",
        last_name="User",
        department="Test Department",
        default_pathway_id=pathway.id,
    )
    await UserRole.create(
        user_id=user.id,
        role_id=test_role.id
    )
    await UserPathway.create(
        user_id=user.id,
        pathway_id=pathway.id
    )
    return UserFixture(
        user=user,
        password=user_info['password'],
        role=test_role
    )


@pytest.fixture
async def test_mdts(test_user: UserFixture, test_pathway: Pathway):

    list_of_mdt_info = [
        {
            "planned_at": datetime.date(3000, 1, 1),
            "location": "In a cabin in the woods",
            "pathway_id": test_pathway.id
        },
        {
            "planned_at": datetime.date(3000, 5, 1),
            "location": "Out by the lake",
            "pathway_id": test_pathway.id
        }
    ]

    list_of_mdts: List[MDT] = []

    for mdt_info in list_of_mdt_info:
        list_of_mdts.append(
            await MDT.create(
                **mdt_info,
                creator_user_id=test_user.user.id
            )
        )
    return list_of_mdts


@pytest.fixture
async def test_on_mdts(
    test_user: UserFixture, test_mdts: List[MDT],
    test_patients_on_pathway: List[OnPathway],
    test_clinical_request_type: ClinicalRequestType
):
    on_mdts: List[OnMdt] = []
    for index, op in enumerate(test_patients_on_pathway):
        clinical_request: ClinicalRequest = await ClinicalRequest.create(
            on_pathway_id=op.id,
            current_state=ClinicalRequestState.COMPLETED,
            completed_at=datetime.datetime.now(),
            clinical_request_type_id=test_clinical_request_type.id,
        )
        on_mdts.append(await OnMdt.create(
            mdt_id=test_mdts[0].id,
            patient_id=op.patient_id,
            user_id=test_user.user.id,
            reason="test reason",
            clinical_request_id=clinical_request.id,
            order=index
        ))
    return on_mdts


@pytest.fixture
async def httpx_login_user(
    test_user: UserFixture, httpx_test_client
) -> Response:
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
async def login_user(test_user: UserFixture, test_client) -> Response:
    res = await test_client.post(
        path="/rest/login/",
        json={
            "username": test_user.user.username,
            "password": test_user.password,
        }
    )
    yield res


@pytest.fixture
def mock_trust_adapter():
    trust_adapter_mock = AsyncMock(spec=TrustAdapter)
    trust_adapter_mock = trust_adapter_mock
    with app.container.trust_adapter_client.override(trust_adapter_mock):
        yield trust_adapter_mock


@pytest.fixture
def test_sdpubsub():
    test_sdpubsub = SdPubSub()
    with app.container.pubsub_client.override(test_sdpubsub):
        yield test_sdpubsub


@pytest.fixture
def test_email_adapter():
    test_email_adapter = EmailAdapter()
    with app.container.email_client.override(test_email_adapter):
        yield test_email_adapter


# PERMISSION FIXTURES
# DECISION
@pytest.fixture
async def decision_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.DECISION_CREATE
    ).create()


@pytest.fixture
async def decision_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.DECISION_READ
    ).create()


# MILESTONE
@pytest.fixture
async def clinical_request_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MILESTONE_CREATE
    ).create()


@pytest.fixture
async def clinical_request_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MILESTONE_READ
    ).create()


@pytest.fixture
async def clinical_request_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MILESTONE_UPDATE
    ).create()


# MILESTONE TYPE
@pytest.fixture
async def clinical_request_type_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MILESTONE_TYPE_READ
    ).create()


# ON PATHWAY
@pytest.fixture
async def on_pathway_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_PATHWAY_CREATE
    ).create()


@pytest.fixture
async def on_pathway_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_PATHWAY_READ
    ).create()


@pytest.fixture
async def on_pathway_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_PATHWAY_UPDATE
    ).create()


# PATHWAY
@pytest.fixture
async def pathway_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.PATHWAY_CREATE
    ).create()


@pytest.fixture
async def pathway_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.PATHWAY_READ
    ).create()


@pytest.fixture
async def pathway_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.PATHWAY_UPDATE
    ).create()


@pytest.fixture
async def pathway_delete_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.PATHWAY_DELETE
    ).create()


# PATIENT
@pytest.fixture
async def patient_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.PATIENT_CREATE
    ).create()


@pytest.fixture
async def patient_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.PATIENT_READ
    ).create()


# ROLE
@pytest.fixture
async def role_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ROLE_CREATE
    ).create()


@pytest.fixture
async def role_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ROLE_READ
    ).create()


@pytest.fixture
async def role_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ROLE_UPDATE
    ).create()


@pytest.fixture
async def role_delete_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ROLE_DELETE
    ).create()


# ROLE PERMISSIONS
@pytest.fixture
async def role_permission_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ROLE_PERMISSIONS_READ
    ).create()


# USER
@pytest.fixture
async def user_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.USER_CREATE
    ).create()


@pytest.fixture
async def user_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.USER_READ
    ).create()


@pytest.fixture
async def user_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.USER_UPDATE
    ).create()


# MDT
@pytest.fixture
async def mdt_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MDT_CREATE
    ).create()


@pytest.fixture
async def mdt_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MDT_UPDATE
    ).create()


@pytest.fixture
async def mdt_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MDT_READ
    ).create()


@pytest.fixture
async def mdt_delete_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.MDT_DELETE
    ).create()


# ONMDT
@pytest.fixture
async def on_mdt_create_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_MDT_CREATE
    ).create()


@pytest.fixture
async def on_mdt_update_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_MDT_UPDATE
    ).create()


@pytest.fixture
async def on_mdt_read_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_MDT_READ
    ).create()


@pytest.fixture
async def on_mdt_delete_permission(test_role) -> RolePermission:
    return await RolePermission(
        role_id=test_role.id,
        permission=Permissions.ON_MDT_DELETE
    ).create()
