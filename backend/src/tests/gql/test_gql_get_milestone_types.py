import json
import pytest
from models import ClinicalRequestType
from hamcrest import (
    assert_that, equal_to,
    has_entries, has_items,
    contains_string
)


@pytest.fixture
async def clinical_request_query() -> dict:
    return {
            "query": (
                """query getClinicalRequestTypes {
                    getClinicalRequestTypes {
                        id
                        name
                        refName
                    }
                }"""
            )
        }


# Feature: Test get clinical_request types
# Scenario: the GraphQL query for getClinicalRequestTypes is executed
@pytest.mark.asyncio
async def test_get_clinical_request_types(
    clinical_request_query,
    clinical_request_type_read_permission,
    httpx_test_client, httpx_login_user
):
    """
    Given: ClinicalRequestTypes are in the system
    """

    inserted_clinical_request_types = []
    for i in range(0, 5):
        mt = await ClinicalRequestType.create(
            name="ClinicalRequestType" + str(i),
            ref_name="ClinicalRequestRef" + str(i)
        )

        inserted_clinical_request_types.append({
            "id": str(mt.id),
            "name": mt.name,
            "refName": mt.ref_name
        })

    res = await httpx_test_client.post(
        url="graphql",
        json=clinical_request_query
    )

    assert_that(res.status_code, equal_to(200))
    clinical_request_type_data = json.loads(res.text)['data']['getClinicalRequestTypes']
    received_clinical_request_types = clinical_request_type_data

    """
    Then: We get the ClinicalRequestTypes in the system
    """
    for mst in inserted_clinical_request_types:
        assert_that(
            received_clinical_request_types,
            has_items(has_entries(mst))
        )


async def test_user_lacks_permission(login_user, test_client, clinical_request_query):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json=clinical_request_query
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
