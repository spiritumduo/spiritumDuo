from datetime import datetime
import pytest
import json
from hamcrest import (
    assert_that, equal_to, is_,
    contains_string,
    empty
)
from typing import List
from httpx import AsyncClient, Response
from tests.conftest import UserFixture
from models import OnMdt, MDT, Pathway


@pytest.fixture
def delete_mdt_query():
    return """
        mutation deleteMdt(
            $id: ID!
            $movePatientsToMdtId: ID
        ){
            deleteMdt(
                input: {
                    id: $id
                    movePatientsToMdtId: $movePatientsToMdtId
                }
            ){
                success
                userErrors{
                    field
                    message
                }
            }
        }
    """


async def test_delete_mdt_no_onmdt(
    mdt_delete_permission: None,
    mdt_update_permission: None,
    httpx_test_client: AsyncClient,
    httpx_login_user: Response,
    test_on_mdts: List[OnMdt],
    test_mdts: List[MDT],
    delete_mdt_query: str,
):
    mdt_to_delete = test_mdts[1]  # mdt has no OnMdt links

    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": delete_mdt_query,
            "variables": {
                "id": mdt_to_delete.id,
            }
        }
    )

    assert_that(res.status_code, equal_to(200))

    response_array = json.loads(res.text)['data']['deleteMdt']
    assert_that(response_array['success'], is_(True))
    assert_that(response_array['userErrors'], is_(None))

    assert_that(
        await MDT.query.where(MDT.id == mdt_to_delete.id).gino.one_or_none(),
        equal_to(None)
    )


async def test_delete_mdt_with_onmdt(
    mdt_delete_permission: None,
    mdt_update_permission: None,
    httpx_test_client: AsyncClient,
    httpx_login_user: Response,
    test_on_mdts: List[OnMdt],
    test_mdts: List[MDT],
    delete_mdt_query: str,
    test_user: UserFixture,
    test_pathway: Pathway
):
    mdt_to_delete = test_mdts[0]  # mdt has OnMdts
    # mdt_to_move_onmdt_to = test_mdts[1]

    mdt_to_move_onmdt_to: MDT = await MDT.create(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location="test location",
        planned_at=datetime(2050, 1, 1)
    )

    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": delete_mdt_query,
            "variables": {
                "id": mdt_to_delete.id,
                "movePatientsToMdtId": mdt_to_move_onmdt_to.id
            }
        }
    )

    assert_that(res.status_code, equal_to(200))

    response_array = json.loads(res.text)['data']['deleteMdt']
    assert_that(response_array['success'], is_(True))
    assert_that(response_array['userErrors'], is_(None))

    assert_that(
        await OnMdt.query.where(OnMdt.mdt_id == mdt_to_delete.id).gino.all(),
        is_(empty())
    )

    assert_that(
        await MDT.query.where(MDT.id == mdt_to_delete.id).gino.one_or_none(),
        equal_to(None)
    )

    on_mdts_from_test_onmdt: List[OnMdt] = await OnMdt.query.where(
        OnMdt.id.in_([om.id for om in test_on_mdts])
    ).gino.all()

    all_from_new_mdt: List[OnMdt] = await OnMdt.query.where(
        OnMdt.mdt_id == mdt_to_move_onmdt_to.id
    ).gino.all()

    assert_that(
        len(on_mdts_from_test_onmdt),
        equal_to(len(all_from_new_mdt))
    )


async def test_user_lacks_permission(
    login_user, test_client,
    delete_mdt_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": delete_mdt_query,
            "variables": {
                "id": "42",
            }
        }
    )
    """
    The request should fail
    """
    payload = res.json()
    assert_that(res.status_code, equal_to(200))
    assert_that(
        payload['errors'][0]['message'],
        contains_string("Missing one or many permissions")
    )
