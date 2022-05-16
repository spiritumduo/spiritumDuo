from typing import List
import pytest
from models import Pathway, PathwayMilestoneType, MilestoneType
from hamcrest import assert_that, equal_to, not_none, none, contains_string


async def test_update_pathway(
    login_user, test_client, pathway_update_permission
):
    # tetsing update pathway graphql mutation

    PATHWAY: Pathway = await Pathway.create(
        name="test pathway go brr"
    )
    NEW_PATHWAY_NAME = "updated pathway go brrr"

    MILESTONE_TYPE_ONE: MilestoneType = await MilestoneType.create(
        name="test milestone one",
        ref_name="ref_test_milestone_one",
    )

    MILESTONE_TYPE_TWO: MilestoneType = await MilestoneType.create(
        name="test milestone two",
        ref_name="ref_test_milestone_two",
    )

    PATHWAY_MILESTONE_TYPE: PathwayMilestoneType = await PathwayMilestoneType\
        .create(
            pathway_id=PATHWAY.id,
            milestone_type_id=MILESTONE_TYPE_ONE.id
        )

    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                mutation updatePathway($input: UpdatePathwayInput!){
                    updatePathway(input: $input){
                        pathway{
                            id
                            name
                            milestoneTypes{
                                id
                                name
                                refName
                            }
                        }
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "input": {
                    "id": PATHWAY.id,
                    "name": NEW_PATHWAY_NAME,
                    "milestoneTypes": [
                        {
                            "id": MILESTONE_TYPE_TWO.id
                        }
                    ]
                }
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    decodedRes = res.json()
    mutationResult = decodedRes['data']['updatePathway']

    assert_that(mutationResult, not_none())
    assert_that(mutationResult['pathway'], not_none())
    assert_that(mutationResult['userErrors'], none())

    pathwayResult = decodedRes['data']['updatePathway']['pathway']

    assert_that(pathwayResult['id'], equal_to(str(PATHWAY.id)))
    assert_that(pathwayResult['name'], equal_to(NEW_PATHWAY_NAME))

    assert_that(
        pathwayResult['milestoneTypes'][0]['id'],
        equal_to(str(MILESTONE_TYPE_TWO.id))
    )
    assert_that(
        pathwayResult['milestoneTypes'][0]['name'],
        equal_to(str(MILESTONE_TYPE_TWO.name))
    )
    assert_that(
        pathwayResult['milestoneTypes'][0]['refName'],
        equal_to(str(MILESTONE_TYPE_TWO.ref_name))
    )

    pathwayDb: Pathway = await Pathway.get(PATHWAY.id)
    assert_that(pathwayDb.name, equal_to(NEW_PATHWAY_NAME))

    pathwayMilestoneTypes: List[PathwayMilestoneType] = await PathwayMilestoneType.query.where(
        PathwayMilestoneType.pathway_id == PATHWAY.id
    ).gino.all()

    assert_that(len(pathwayMilestoneTypes), equal_to(1))
    assert_that(
        pathwayMilestoneTypes[0].milestone_type_id,
        equal_to(MILESTONE_TYPE_TWO.id)
    )


async def test_user_lacks_permission(login_user, test_client):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                mutation updatePathway($input: UpdatePathwayInput!){
                    updatePathway(input: $input){
                        pathway{
                            id
                        }
                    }
                }
            """,
            "variables": {
                "input": {
                    "id": 1,
                    "name": "test go brrt",
                    "milestoneTypes": [
                    ]
                }
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
