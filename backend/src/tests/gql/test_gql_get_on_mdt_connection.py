import json
from typing import List
import pytest
from models import MDT, OnMdt
from hamcrest import (
    assert_that, equal_to,
    not_none,
    contains_string, has_length
)


# Feature: testing getOnMdtConnection
# Scenario: the getOnMdtConnection function is called
@pytest.mark.asyncio
async def test_get_on_mdt_connection(
    mdt_read_permission, patient_read_permission,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_mdts: List[MDT]
):

    """
    When: we execute the query
    """

    get_mdt_conn_query = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getOnMdtConnection(
                    $mdtId: ID!,
                    $first: Int!
                ){
                    getOnMdtConnection(
                        mdtId: $mdtId,
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
                "mdtId": test_mdts[0].id,
                "first": 9
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
        )['data']['getOnMdtConnection'],
        not_none()
    )
    mdt_list = json.loads(
        get_mdt_conn_query.text
    )['data']['getOnMdtConnection']

    """
    Then: we get one mdt on the pathway
    """
    assert_that(
        mdt_list['edges'],
        has_length(9)
    )

    """
    Then: we get the second mdt using the cursor
    """

    get_mdt_conn_query_cursor = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getOnMdtConnection(
                    $mdtId: ID!,
                    $first: Int!
                    $after: String!
                ){
                    getOnMdtConnection(
                        mdtId: $mdtId,
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
                "mdtId": test_mdts[0].id,
                "after": mdt_list['edges'][8]['cursor'],
                "first": 2
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
        )['data']['getOnMdtConnection'],
        not_none()
    )
    patient_list_cursor = json.loads(
        get_mdt_conn_query_cursor.text
    )['data']['getOnMdtConnection']

    """
    Then: we get all the second mdt on that pathway
    """
    assert_that(
        patient_list_cursor['edges'][0]['node']['id'],
        equal_to(str(test_on_mdts[9].patient_id))
    )
    assert_that(
        patient_list_cursor['edges'],
        has_length(1)
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
                query getOnMdtConnection(
                    $mdtId: ID!,
                    $first: Int!
                    $after: String!
                ){
                    getOnMdtConnection(
                        mdtId: $mdtId,
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
                "mdtId": "42",
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
