from models import Pathway, PathwayMilestoneType
from hamcrest import assert_that, equal_to, not_none, none, contains_string


async def test_delete_pathway_conflict(
    login_user, test_client, pathway_delete_permission,
    test_pathway, test_patients_on_pathway
):
    # testing delete pathway graphql mutation

    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                mutation deletePathway($pathwayId: ID!){
                    deletePathway(id: $pathwayId){
                        success
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": test_pathway.id
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    decodedRes = res.json()
    mutationResult = decodedRes['data']['deletePathway']

    assert_that(mutationResult['userErrors'], not_none())
    assert_that(
        mutationResult['userErrors'][0]['message'],
        contains_string("cannot remove a pathway")
    )
    assert_that(mutationResult['success'], none())


async def test_delete_pathway_success(
    login_user, test_client, pathway_delete_permission,
    test_milestone_type
):
    # testing delete pathway graphql mutation

    PATHWAY: Pathway = await Pathway.create(
        name="Testing pathway go brrt"
    )

    await PathwayMilestoneType.create(
        pathway_id=PATHWAY.id,
        milestone_type_id=test_milestone_type.id
    )

    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                mutation deletePathway($pathwayId: ID!){
                    deletePathway(id: $pathwayId){
                        success
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": PATHWAY.id
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    decodedRes = res.json()
    mutationResult = decodedRes['data']['deletePathway']

    assert_that(mutationResult['userErrors'], none())
    assert_that(mutationResult['success'], equal_to(True))


async def test_user_lacks_permission(
    login_user, test_client, test_pathway
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                mutation deletePathway($pathwayId: ID!){
                    deletePathway(id: $pathwayId){
                        success
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": test_pathway.id
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
