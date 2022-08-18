# GraphQL

## Queries

The design of the queries is that all of the business logic is abstracted, so it's simpler to migrate to a new GraphQL implementation if required.  
  
The returning result should be an object, or a list of objects.  
If the query is returning many objects, it should always return a list object, empty or not.
  
For example, `getPathways` should return `[]` if no pathways are found by that criteria (GraphQL notation `[Pathway]!`). This is not implemented widely and should be refactored. This will involve frontend work as the generated types will need updating (SDB-259).

```gql
getMdts(pathwayId: ID!, includePast: Boolean = False): [MDT]!
```
