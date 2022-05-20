import json
from hamcrest import assert_that, equal_to, not_none, contains_string


async def test_get_pathway(
    httpx_test_client, pathway_read_permission,
    httpx_login_user, test_pathway
):
    get_pathway_query = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getPathway(
                    $id: ID!
                ){
                    getPathway(id: $id){
                        id
                        name
                    }
                }
            """,
            "variables": {
                "id": test_pathway.id
            }
        }
    )

    assert_that(get_pathway_query.status_code, equal_to(200))
    get_pathway_query = json.loads(
        get_pathway_query.text
    )['data']['getPathway']

    """
    Then: we get the pathway data
    """

    assert_that(get_pathway_query['id'], not_none())
    assert_that(get_pathway_query['name'], equal_to(test_pathway.name))


async def test_user_lacks_permission(
    login_user, test_client,
    test_pathway
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                query getPathway(
                    $id: ID!
                ){
                    getPathway(id: $id){
                        id
                        name
                    }
                }
            """,
            "variables": {
                "id": test_pathway.id
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
