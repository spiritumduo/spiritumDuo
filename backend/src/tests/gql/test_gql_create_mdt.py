import json
import pytest
from models import MDT
from hamcrest import assert_that, equal_to, not_none, contains_string


@pytest.fixture
def mdt_create_mutation() -> str:
    return """
        mutation createMdt(
            $plannedAt: Date!
            $location: String!
            $pathwayId: ID!

        ){
            createMdt(input: {
                plannedAt: $plannedAt
                location: $location
                pathwayId: $pathwayId
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
async def test_add_new_mdt(
    mdt_create_permission,
    mdt_create_mutation, test_pathway,
    httpx_test_client, httpx_login_user,
    test_user
):
    """
    When: we create an MDT
    """
    _MDT = MDT(
        pathway_id=test_pathway.id,
        planned_at="3000-01-01T00:00:00",
        location="A cave on the north coast"
    )

    query = await httpx_test_client.post(
        url="graphql",
        json={
            "query": mdt_create_mutation,
            "variables": {
                "plannedAt": _MDT.planned_at,
                "location": _MDT.location,
                "pathwayId": _MDT.pathway_id
            }
        }
    )

    assert_that(query.status_code, equal_to(200))
    query = json.loads(
        query.text
    )['data']['createMdt']

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
        query['mdt']['creator']['id'],
        equal_to(str(test_user.user.id))
    )
    assert_that(
        query['mdt']['location'],
        equal_to(_MDT.location)
    )
    assert_that(
        query['mdt']['plannedAt'],
        equal_to(_MDT.planned_at)
    )


async def test_user_lacks_permission(
    login_user, test_client,
    mdt_create_mutation
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": mdt_create_mutation,
            "variables": {
                "plannedAt": "3000-01-01T00:00:00",
                "location": "test",
                "pathwayId": "42"
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
