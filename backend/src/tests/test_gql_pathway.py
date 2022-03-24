import json
import pytest
from models import Pathway
from hamcrest import assert_that, equal_to, not_none


# Feature: Test createPathway GQL mutation
# Scenario: the GraphQL query for createPathway is executed
@pytest.mark.asyncio
async def test_add_new_pathway(context):
    """
    When: we create a pathway
    """
    PATHWAY = Pathway(
        name="Test pathway"
    )

    create_pathway_query = await context.client.post(
        url="graphql",
        json={
            "query": """
                mutation createPathway(
                    $name: String!
                ){
                    createPathway(input: {
                        name: $name
                    }){
                        pathway{
                            id
                            name
                        }
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "name": PATHWAY.name
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


@pytest.mark.asyncio
async def test_get_pathway(context):
    """
    Given: a pathway exists
    """
    PATHWAY = await Pathway.create(
        name="Test pathway"
    )

    """
    When: the gql query is executed to get the pathway
    """

    get_pathway_query = await context.client.post(
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
                "id": PATHWAY.id
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
    assert_that(get_pathway_query['name'], equal_to(PATHWAY.name))


# Feature: Test getPathways GQL mutation
# Scenario: the GraphQL query for createPathway is executed
@pytest.mark.asyncio
async def test_get_pathways(context):
    """
    Given: MilestoneTypes are in the system
    """
    PATHWAY_ONE = await Pathway.create(
        name="Test pathway one"
    )
    PATHWAY_TWO = await Pathway.create(
        name="Test pathway two"
    )
    """
    When: we run the gql query to get all pathways
    """

    get_pathway_query = await context.client.post(
        url="graphql",
        json={
            "query": """
                query getPathways{
                    getPathways{
                        id
                        name
                    }
                }
            """
        }
    )

    assert_that(get_pathway_query.status_code, equal_to(200))
    get_pathway_query = json.loads(
        get_pathway_query.text
    )['data']['getPathways']

    """
    Then: we get all pathways
    """

    # NOTE: the list indicies start at one and not zero because a user
    # is required to login, and that user is required to have a
    # `default_pathway_id` and so a pathway has to be created in `conftest.py`
    # to authenticate on the graphql endpoint
    assert_that(get_pathway_query[1]['id'], not_none())
    assert_that(get_pathway_query[1]['name'], equal_to(PATHWAY_ONE.name))
    assert_that(get_pathway_query[2]['id'], not_none())
    assert_that(get_pathway_query[2]['name'], equal_to(PATHWAY_TWO.name))
