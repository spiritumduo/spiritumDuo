import json
import pytest
from models import MilestoneType
from hamcrest import assert_that, equal_to, has_entries, has_items


# Feature: Test get milestone types
# Scenario: the GraphQL query for getMilestoneTypes is executed
@pytest.mark.asyncio
async def test_get_milestone_types(context):
    """
    Given: MilestoneTypes are in the system
    """

    milestone_types = []
    for i in range(0, 5):
        mt = await MilestoneType.create(
            name="MilestoneType" + str(i),
            ref_name="MilestoneRef" + str(i)
        )

        milestone_types.append({
            "id": str(mt.id),
            "name": mt.name,
            "refName": mt.ref_name
        })

    context.inserted_milestone_types = milestone_types

    res = await context.client.post(
        url="graphql",
        json={
            "query": (
                """query getMilestoneTypes {
                    getMilestoneTypes {
                        id
                        name
                        refName
                    }
                }"""
            )
        }
    )

    assert_that(res.status_code, equal_to(200))
    milestone_type_data = json.loads(res.text)['data']['getMilestoneTypes']
    context.received_milestone_types = milestone_type_data

    """
    Then: We get the MilestoneTypes in the system
    """
    for mst in context.inserted_milestone_types:
        assert_that(
            context.received_milestone_types,
            has_items(has_entries(mst))
        )
