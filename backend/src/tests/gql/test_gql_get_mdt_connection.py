from datetime import datetime
import json
import pytest
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
    test_mdt, test_user,
    httpx_test_client, httpx_login_user,
    test_pathway
):
    """
    Given: we have MDTs in our database
    """
    mdt = await MDT.create(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test',
        planned_at=datetime(3030, 1, 1)
    )

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

    """
    Then: we get one mdt on the pathway
    """
    assert_that(
        mdt_list['edges'][0]['node']['id'],
        equal_to(str(test_mdt.id))
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
    patient_list_cursor = json.loads(
        get_mdt_conn_query_cursor.text
    )['data']['getMdtConnection']

    """
    Then: we get all the second mdt on that pathway
    """
    assert_that(
        patient_list_cursor['edges'][0]['node']['id'],
        equal_to(str(mdt.id))
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
