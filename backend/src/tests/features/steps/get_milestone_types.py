import logging

import threading
from behave import *
from behave.api.async_step import async_run_until_complete
import asyncio
from hamcrest import *
import json
from models import MilestoneType

GRAPHQL_ENDPOINT = "graphql"


@given("MilestoneTypes are in the system")
@async_run_until_complete
async def step_impl(context):

    conn = await context.engine.acquire()
    milestone_types = []
    for i in range(0, 5):
        mt = await MilestoneType.create(
            bind=conn,
            name="MilestoneType" + str(i),
            ref_name="MilestoneRef" + str(i)
        )

        milestone_types.append({
            "id": str(mt.id),
            "name": mt.name,
            "refName": mt.ref_name
        })

    context.inserted_milestone_types = milestone_types


@when("We run getMilestoneTypes query")
def step_impl(context):
    query = {
        "query": (
            'query getMilestoneTypes {'
                'getMilestoneTypes {'
                    'id '
                    'name '
                    'refName '
                '}'
            '}'
        )
    }

    res = context.client.post(
        url=GRAPHQL_ENDPOINT,
        json=query
    )

    assert_that(res.status_code, equal_to(200))
    milestone_type_data = json.loads(res.text)['data']['getMilestoneTypes']
    context.received_milestone_types = milestone_type_data


@then("We get the MilestoneTypes in the system")
def step_impl(context):
    for mst in context.inserted_milestone_types:
        assert_that(context.received_milestone_types, has_items(has_entries(mst)))
