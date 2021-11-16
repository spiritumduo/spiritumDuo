# schema.py
from ariadne import QueryType, ObjectType, make_executable_schema, gql
from .loaders import CatsLoader, MeowLoader

type_defs = gql("""
    type Query {
        hello: String!
        someNumber(count: Int!): String!
        getCat(id: ID!): Cat
        getCats(ids: [ID!]!): [Cat]
    }
    
    type CatResult {
        success: Boolean!
        errors: [String]
        cat: Cat
    }
    
    type Cat {
        id: ID!
        firstName: String!
        lastName: String!
        meow: String!
    }
""")

query = QueryType()

@query.field("hello")
def resolve_hello(obj=None, info=None):
    return str(obj)


@query.field("someNumber")
def resolve_some_number(_=None, info=None, count: int = None):
    request = info.context["request"]
    user_agent = request.headers.get("user-agent", "guest")
    return str(count) + user_agent


cat = ObjectType("Cat")

async def load_cats(context=None, ids=None):
    loader_name = "_cats_loader"
    if loader_name not in context:
        context[loader_name] = CatsLoader()
    cats = await context[loader_name].load(ids)
    return cats

async def load_many_cats(context=None, ids=None):
    loader_name = "_cats_loader"
    if loader_name not in context:
        context[loader_name] = CatsLoader()
    cats = await context[loader_name].load_many(ids)
    return cats

async def load_meows(context=None, ids=None):
    loader_name = "_meow_loader"
    if loader_name not in context:
        context[loader_name] = MeowLoader()
    return await context[loader_name].load(ids)

async def load_many_meows(context=None, ids=None):
    loader_name = "_meow_loader"
    if loader_name not in context:
        context[loader_name] = MeowLoader()
    return await context[loader_name].load_many(ids)

@query.field("getCat")
async def resolve_get_cat(_=None, info=None, id=None):
    cat = await load_cats(info.context, id)
    meow = await load_meows(info.context, id)
    print(cat)
    catObj = {
        'first_name': cat.first_name,
        'last_name': cat.last_name,
        'meow': meow,
    }
    return catObj

@query.field("getCats")
async def resolve_get_cats(_=None, info=None, ids=None):
    cat = await load_many_cats(info.context, ids)
    meow = await load_many_meows(info.context, ids)
    print(cat)
    catList = []
    for i in range(0, len(cat)):
        if cat[i] != None:
            catObj = {
                'first_name': cat[i].first_name,
                'last_name': cat[i].last_name,
                'meow': meow[i],
            }
            catList.append(catObj)
        else:
            catList.append(None)

    return catList

@cat.field("firstName")
async def resolve_cat_first_name(obj=None, *_):
    return obj['first_name']


@cat.field("lastName")
async def resolve_cat_last_name(obj=None, *_):
    return obj['last_name']


@cat.field("meow")
async def resolve_cat_meow(obj=None, *_):
    return obj['meow']


schema = make_executable_schema(type_defs, query, cat)
