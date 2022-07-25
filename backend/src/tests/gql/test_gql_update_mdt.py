from datetime import datetime
import json
from typing import List
import pytest
from models import MDT, User, UserMDT
from hamcrest import (
    assert_that,
    equal_to,
    not_none,
    contains_string,
    has_length
)


@pytest.fixture
def mdt_update_mutation() -> str:
    return """
        mutation updateMdt(
            $plannedAt: Date!
            $location: String!
            $id: ID!
            $users: [ID]!
        ){
            updateMdt(input: {
                plannedAt: $plannedAt
                location: $location
                id: $id
                users: $users
            }){
                mdt{
                    id
                    pathway{
                        id
                        name
                    }
                    creator{
                        id
                        username
                    }
                    clinicians{
                        id
                    }
                    createdAt
                    plannedAt
                    updatedAt
                    location
                }
                userErrors{
                    field
                    message
                }
            }
        }
    """


# Feature: Test createPathway GQL mutation
# Scenario: the GraphQL query for createPathway is executed
async def test_update_mdt(
    mdt_update_permission,
    mdt_update_mutation,
    httpx_test_client, httpx_login_user,
    test_mdts: List[MDT], test_user
):
    USER_INFO = {
        "first_name": "Test",
        "last_name": "User",
        "department": "Test dummy department",
        "email": "test@test.com",
        "username": "tdummy",
        "password": "tdummy",
    }
    _USER = await User.create(
        first_name=USER_INFO['first_name'],
        last_name=USER_INFO['last_name'],
        department=USER_INFO['department'],
        email=USER_INFO['email'],
        username=USER_INFO['username'],
        password='encrypt me lol'
    )

    await UserMDT.create(
        mdt_id=test_mdts[0].id,
        user_id=_USER.id
    )

    """
    When: we update an MDT
    """
    _MDT = MDT(
        planned_at="2030-01-01T00:00:00",
        location="A cave on the north coast"
    )

    query = await httpx_test_client.post(
        url="graphql",
        json={
            "query": mdt_update_mutation,
            "variables": {
                "id": test_mdts[0].id,
                "location": _MDT.location,
                "plannedAt": _MDT.planned_at,
                "users": [test_user.user.id]
            }
        }
    )

    assert_that(query.status_code, equal_to(200))
    query = json.loads(
        query.text
    )['data']['updateMdt']

    """
    Then: We get the returned pathway data
    """
    assert_that(
        query['mdt'],
        not_none()
    )
    assert_that(
        query['mdt']['id'],
        not_none()
    )
    assert_that(
        query['mdt']['location'],
        equal_to(_MDT.location)
    )
    assert_that(
        query['mdt']['plannedAt'],
        equal_to(_MDT.planned_at)
    )
    assert_that(
        query['mdt']['clinicians'][0]['id'],
        equal_to(str(test_user.user.id))
    )
    assert_that(
        query['mdt']['clinicians'],
        has_length(1)
    )

    updated_mdt: MDT = await MDT.get(int(query['mdt']['id']))
    assert_that(
        updated_mdt.location,
        equal_to(_MDT.location)
    )
    assert_that(
        updated_mdt.planned_at,
        equal_to(datetime.fromisoformat(_MDT.planned_at))
    )


async def test_user_lacks_permission(
    login_user, test_client,
    mdt_update_mutation
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": mdt_update_mutation,
            "variables": {
                "plannedAt": "3000-01-01T00:00:00",
                "location": "test",
                "id": "42",
                "users": [],
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
