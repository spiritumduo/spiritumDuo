# GraphQL

## Types

Type resolvers are used for complex GraphQL object types. For example, the ability to get a clinican's information from a decision point.
If a field name is the same on the object as it is in the schema, it will automatically resolve to that field.
  
```python
DecisionPointObjectType = ObjectType("DecisionPoint")

@DecisionPointObjectType.field("clinician")
async def resolve_on_pathway_clinician(
    obj: DecisionPoint = None, info: GraphQLResolveInfo = None, *_
):
    return await UserByIdLoader.load_from_id(
        context=info.context, id=obj.clinician_id)
```
