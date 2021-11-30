from .query_type import query

@query.field("test")
async def resolve_test(obj=None, info=None):
    return {
        "message":"Hello, world! This is a test!"
    }