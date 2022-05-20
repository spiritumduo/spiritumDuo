import json
import pytest
from models import Pathway
from hamcrest import assert_that, equal_to, not_none, contains_string


@pytest.fixture
def pathway_create_mutation() -> str:
    return """
        mutation createPathway(
            $name: String!
            $milestoneTypes: [MilestoneTypeInput!]
        ){
            createPathway(input: {
                name: $name
                milestoneTypes: $milestoneTypes
            }){
                pathway{
                    id
                    name
                    milestoneTypes{
                        id
                    }
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
async def test_add_new_pathway(
    pathway_create_permission,
    pathway_create_mutation, test_milestone_type,
    httpx_test_client, httpx_login_user
):
    """
    When: we create a pathway
    """
    PATHWAY = Pathway(
        name="Test pathway"
    )

    create_pathway_query = await httpx_test_client.post(
        url="graphql",
        json={
            "query": pathway_create_mutation,
            "variables": {
                "name": PATHWAY.name,
                "milestoneTypes": [{
                    "id": test_milestone_type.id
                }]
            }
        }
    )

    assert_that(create_pathway_query.status_code, equal_to(200))
    create_pathway_query = json.loads(
        create_pathway_query.text
    )['data']['createPathway']

    """
    Then: We get the returned pathway data
    """
    assert_that(
        create_pathway_query['pathway'],
        not_none()
    )
    assert_that(
        create_pathway_query['pathway']['id'],
        not_none()
    )
    assert_that(
        create_pathway_query['pathway']['name'],
        equal_to(PATHWAY.name)
    )
    assert_that(
        create_pathway_query['pathway']['milestoneTypes'],
        not_none()
    )
    assert_that(
        create_pathway_query['pathway']['milestoneTypes'][0]['id'],
        equal_to(str(test_milestone_type.id))
    )


async def test_user_lacks_permission(
    login_user, test_client,
    pathway_create_mutation
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": pathway_create_mutation,
            "variables": {
                "name": "test"
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