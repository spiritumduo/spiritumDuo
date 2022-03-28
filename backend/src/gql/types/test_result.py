from ariadne.objects import ObjectType
from dataloaders import TestResultByReferenceIdFromIELoader
from trustadapter.trustadapter import TestResult_IE
from graphql.type import GraphQLResolveInfo

TestResultObjectType = ObjectType("TestResult")


@TestResultObjectType.field("description")
async def resolve_description(
    obj: TestResult_IE = None, info: GraphQLResolveInfo = None, *_
):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(
        context=info.context, id=obj.id)
    return record.description


@TestResultObjectType.field("currentState")
async def resolve_current_state(
    obj: TestResult_IE = None, info: GraphQLResolveInfo = None, *_
):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(
        context=info.context, id=obj.id)
    return record.current_state.value


@TestResultObjectType.field("typeReferenceName")
async def resolve_type_reference_name(
    obj: TestResult_IE = None, info: GraphQLResolveInfo = None, *_
):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(
        context=info.context, id=obj.id)
    return record.type_reference_name


@TestResultObjectType.field("addedAt")
async def resolve_added_at(
    obj: TestResult_IE = None, info: GraphQLResolveInfo = None, *_
):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(
        context=info.context, id=obj.id)
    return record.added_at


@TestResultObjectType.field("updatedAt")
async def resolve_updated_at(
    obj: TestResult_IE = None, info: GraphQLResolveInfo = None, *_
):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(
        context=info.context, id=obj.id)
    return record.updated_at
