from ariadne.objects import ObjectType
from dataloaders import TestResultByReferenceIdFromIELoader
from trustadapter.trustadapter import TestResult_IE

TestResultObjectType = ObjectType("TestResult")

@TestResultObjectType.field("description")
async def resolver(obj:TestResult_IE=None, info=None, *_):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)    
    return record.description

@TestResultObjectType.field("currentState")
async def resolver(obj:TestResult_IE=None, info=None, *_):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)    
    return record.current_state

@TestResultObjectType.field("typeReferenceName")
async def resolver(obj:TestResult_IE=None, info=None, *_):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)    
    return record.type_reference_name

@TestResultObjectType.field("addedAt")
async def resolver(obj:TestResult_IE=None, info=None, *_):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)    
    return record.added_at

@TestResultObjectType.field("updatedAt")
async def resolver(obj:TestResult_IE=None, info=None, *_):
    record = await TestResultByReferenceIdFromIELoader.load_from_id(context=info.context, id=obj.id)    
    return record.updated_at