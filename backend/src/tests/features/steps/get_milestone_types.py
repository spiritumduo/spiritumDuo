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

        milestone_types.append(mt)

    context.milestone_types = milestone_types


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
    context.milestone_type_data = milestone_type_data


@then("We get the MilestoneTypes in the system")
def step_impl(context):
    print(context.milestone_type_data)
    print(context.milestone_types)
    for i in range(0, 4):
        assert_that(
            context.milestone_type_data[0]['name'],
            equal_to(context.milestone_types[0].name)
        )
        assert_that(
            context.milestone_type_data[0]['refName'],
            equal_to(context.milestone_types[0].ref_name)
        )
