from datetime import datetime
import json
from typing import List
import pytest
from tests.conftest import UserFixture
from models import MDT
from hamcrest import (
    assert_that, equal_to,
    not_none,
    contains_string
)


# Feature: testing getMdtConnection
# Scenario: the getMdtConnection function is called
@pytest.mark.asyncio
async def test_get_mdt_connection(
    mdt_read_permission,
    test_mdts: List[MDT], test_user: UserFixture,
    httpx_test_client, httpx_login_user,
    test_pathway
):
    """
    Given: we have MDTs in our database
    """

    """
    When: we execute the query
    """

    get_mdt_conn_query = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getMdtConnection(
                    $pathwayId: ID!,
                    $first: Int!
                ){
                    getMdtConnection(
                        pathwayId: $pathwayId,
                        first: $first
                    ){
                        totalCount
                        edges{
                            cursor
                            node{
                                id
                            }
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": test_pathway.id,
                "first": 1
            }
        }
    )

    assert_that(
        get_mdt_conn_query.status_code,
        equal_to(200)
    )  # check the HTTP status for 200 OK
    assert_that(
        json.loads(
            get_mdt_conn_query.text
        )['data']['getMdtConnection'],
        not_none()
    )
    mdt_list = json.loads(
        get_mdt_conn_query.text
    )['data']['getMdtConnection']

    print(mdt_list)
    print([mdt.id for mdt in test_mdts])

    """
    Then: we get one mdt on the pathway
    """
    assert_that(
        mdt_list['edges'][0]['node']['id'],
        equal_to(str(test_mdts[0].id))
    )

    """
    Then: we get the second mdt using the cursor
    """

    get_mdt_conn_query_cursor = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getMdtConnection(
                    $pathwayId: ID!,
                    $first: Int!
                    $after: String!
                ){
                    getMdtConnection(
                        pathwayId: $pathwayId,
                        after: $after,
                        first: $first
                    ){
                        totalCount
                        edges{
                            cursor
                            node{
                                id
                            }
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": test_pathway.id,
                "after": mdt_list['edges'][0]['cursor'],
                "first": 1
            }
        }
    )

    assert_that(
        get_mdt_conn_query_cursor.status_code,
        equal_to(200)
    )  # check the HTTP status for 200 OK
    assert_that(
        json.loads(
            get_mdt_conn_query_cursor.text
        )['data']['getMdtConnection'],
        not_none()
    )
    connection_result = json.loads(
        get_mdt_conn_query_cursor.text
    )['data']['getMdtConnection']

    """
    Then: we get all the second mdt on that pathway
    """
    assert_that(
        connection_result['edges'][0]['node']['id'],
        equal_to(str(test_mdts[1].id))
    )


async def test_user_lacks_permission(
    login_user, test_client
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                query getPatientOnPathwayConnection(
                    $pathwayId: ID!,
                    $first: Int!
                    $after: String!
                ){
                    getPatientOnPathwayConnection(
                        pathwayId: $pathwayId,
                        after: $after,
                        first: $first
                    ){
                        totalCount
                        edges{
                            cursor
                            node{
                                id
                            }
                        }
                    }
                }
                """,
            "variables": {
                "pathwayId": "test",
                "first": 12,
                "after": "something"
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
