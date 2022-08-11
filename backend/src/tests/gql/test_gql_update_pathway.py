from typing import List
from models import Pathway, PathwayClinicalRequestType, ClinicalRequestType
from hamcrest import assert_that, equal_to, not_none, none, contains_string


async def test_update_pathway(
    login_user, test_client, pathway_update_permission
):
    # tetsing update pathway graphql mutation

    PATHWAY: Pathway = await Pathway.create(
        name="test pathway go brr"
    )
    NEW_PATHWAY_NAME = "updated pathway go brrr"

    MILESTONE_TYPE_ONE: ClinicalRequestType = await ClinicalRequestType.create(
        name="test clinical_request one",
        ref_name="ref_test_clinical_request_one",
    )

    MILESTONE_TYPE_TWO: ClinicalRequestType = await ClinicalRequestType.create(
        name="test clinical_request two",
        ref_name="ref_test_clinical_request_two",
    )

    PATHWAY_MILESTONE_TYPE: PathwayClinicalRequestType = await PathwayClinicalRequestType\
        .create(
            pathway_id=PATHWAY.id,
            clinical_request_type_id=MILESTONE_TYPE_ONE.id
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
                            clinicalRequestTypes{
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
                    "clinicalRequestTypes": [
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
        pathwayResult['clinicalRequestTypes'][0]['id'],
        equal_to(str(MILESTONE_TYPE_TWO.id))
    )
    assert_that(
        pathwayResult['clinicalRequestTypes'][0]['name'],
        equal_to(str(MILESTONE_TYPE_TWO.name))
    )
    assert_that(
        pathwayResult['clinicalRequestTypes'][0]['refName'],
        equal_to(str(MILESTONE_TYPE_TWO.ref_name))
    )

    pathwayDb: Pathway = await Pathway.get(PATHWAY.id)
    assert_that(pathwayDb.name, equal_to(NEW_PATHWAY_NAME))

    pathwayClinicalRequestTypes: List[PathwayClinicalRequestType] = await \
        PathwayClinicalRequestType.query.where(
            PathwayClinicalRequestType.pathway_id == PATHWAY.id
        ).gino.all()

    assert_that(len(pathwayClinicalRequestTypes), equal_to(1))
    assert_that(
        pathwayClinicalRequestTypes[0].clinical_request_type_id,
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
                    "clinicalRequestTypes": [
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
