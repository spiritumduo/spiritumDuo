from datetime import datetime, timedelta
from json import loads
import pytest
from hamcrest import (
    assert_that, equal_to, none, is_,
    contains_string, not_none
)
from models import OnMdt, User


@pytest.fixture
def lock_on_mdt_query() -> str:
    return """
        mutation lockOnMdt(
            $id: ID!
            $unlock: Boolean!
        ){
            lockOnMdt(input: {
                id: $id
                unlock: $unlock
            }){
                onMdt{
                    id
                }
                userErrors{
                    field
                    message
                }
            }
        }
    """


# Feature: testing lockOnMdt
# Scenario: an OnMdt record needs to be locked
async def test_lock_on_mdt(
    lock_on_mdt_query,
    on_mdt_read_permission,
    on_mdt_update_permission,
    patient_read_permission,
    test_on_mdts,
    httpx_test_client,
    httpx_login_user,
    test_user
):
    on_mdt: OnMdt = test_on_mdts[0]

    lock_mutation = await httpx_test_client.post(
        url="graphql",
        json={
            "query": lock_on_mdt_query,
            "variables": {
                "id": on_mdt.id,
                "unlock": False,
            }
        }
    )
    assert_that(lock_mutation.status_code, equal_to(200))
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['onMdt']['id'],
        equal_to(str(on_mdt.id))
    )
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['userErrors'],
        is_(none())
    )

    check_on_mdt: OnMdt = await OnMdt.get(on_mdt.id)
    assert_that(check_on_mdt.lock_user_id, equal_to(test_user.user.id))


# Scenario: an OnMdt record needs to be unlocked
async def test_unlock_on_mdt(
    lock_on_mdt_query,
    on_mdt_read_permission,
    on_mdt_update_permission,
    patient_read_permission,
    test_on_mdts,
    httpx_test_client,
    httpx_login_user,
    test_user
):
    on_mdt: OnMdt = test_on_mdts[0]
    await on_mdt.update(
        lock_user_id=test_user.user.id,
        lock_end_time=datetime.now() + timedelta(minutes=60)
    ).apply()

    lock_mutation = await httpx_test_client.post(
        url="graphql",
        json={
            "query": lock_on_mdt_query,
            "variables": {
                "id": on_mdt.id,
                "unlock": True,
            }
        }
    )
    assert_that(lock_mutation.status_code, equal_to(200))
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['onMdt']['id'],
        equal_to(str(on_mdt.id))
    )
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['userErrors'],
        is_(none())
    )

    check_on_mdt: OnMdt = await OnMdt.get(on_mdt.id)
    assert_that(check_on_mdt.lock_user_id, is_(none()))


# Scenario: an OnMdt record needs to be locked but is locked by someone else
async def test_lock_someone_elses_locked_on_mdt(
    lock_on_mdt_query,
    on_mdt_read_permission,
    on_mdt_update_permission,
    patient_read_permission,
    test_on_mdts,
    httpx_test_client,
    httpx_login_user,
    test_user,
    test_pathway
):
    other_user: User = await User.create(
        username="otheruser",
        password="password",
        email="other@user.org.doesntexist",
        first_name="other",
        last_name="user",
        department="testing",
        default_pathway_id=test_pathway.id,
    )
    on_mdt: OnMdt = test_on_mdts[0]
    await on_mdt.update(
        lock_user_id=other_user.id,
        lock_end_time=datetime.now() + timedelta(minutes=60)
    ).apply()

    lock_mutation = await httpx_test_client.post(
        url="graphql",
        json={
            "query": lock_on_mdt_query,
            "variables": {
                "id": on_mdt.id,
                "unlock": False,
            }
        }
    )
    assert_that(lock_mutation.status_code, equal_to(200))
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['onMdt']['id'],
        equal_to(str(on_mdt.id))
    )
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['userErrors'],
        is_(not_none())
    )

    check_on_mdt: OnMdt = await OnMdt.get(on_mdt.id)
    assert_that(check_on_mdt.lock_user_id, equal_to(other_user.id))


# Scenario: an OnMdt record needs to be unlocked but is locked by someone else
async def test_unlock_someone_elses_lock_on_mdt(
    lock_on_mdt_query,
    on_mdt_read_permission,
    on_mdt_update_permission,
    patient_read_permission,
    test_on_mdts,
    httpx_test_client,
    httpx_login_user,
    test_user,
    test_pathway
):
    other_user: User = await User.create(
        username="otheruser",
        password="password",
        email="other@user.org.doesntexist",
        first_name="other",
        last_name="user",
        department="testing",
        default_pathway_id=test_pathway.id,
    )
    on_mdt: OnMdt = test_on_mdts[0]
    await on_mdt.update(
        lock_user_id=other_user.id,
        lock_end_time=datetime.now() + timedelta(minutes=60)
    ).apply()

    lock_mutation = await httpx_test_client.post(
        url="graphql",
        json={
            "query": lock_on_mdt_query,
            "variables": {
                "id": on_mdt.id,
                "unlock": True,
            }
        }
    )
    assert_that(lock_mutation.status_code, equal_to(200))
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['onMdt']['id'],
        equal_to(str(on_mdt.id))
    )
    assert_that(
        loads(lock_mutation.text)['data']['lockOnMdt']['userErrors'],
        is_(not_none())
    )

    check_on_mdt: OnMdt = await OnMdt.get(on_mdt.id)
    assert_that(check_on_mdt.lock_user_id, equal_to(other_user.id))


async def test_user_lacks_permission(
    login_user, test_client,
    lock_on_mdt_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": lock_on_mdt_query,
            "variables": {
                "id": 1,
                "unlock": True
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
