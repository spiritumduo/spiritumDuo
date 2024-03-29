# GraphQL API

## Overview

[GraphQL](https://graphql.org/) is a query language for APIs. Clients can select the data they need based on their requirements and permissions. GraphQL modelling uses [graph theory](https://www.tutorialspoint.com/graph_theory/graph_theory_fundamentals.htm). In this project, this means that from a `Patient` object, you can get their pathways, test requests, etc, all in one `getPatient` query.
  
GraphQL APIs are better because

- we can reuse queries
- queries are more optimised because [under/overfetching](https://stackoverflow.com/questions/44564905/what-is-over-fetching-or-under-fetching) is not a problem
  
RESTful APIs are better because

- the server has more control over the data given to the client
- they use HTTP caching automatically
- supports API versioning

The GraphQL implementation is organised as such that it's not closely tied to Starlette, meaning that if the need arose to use another framework, it could be easily re-implemented.

## Authorization

GraphQL queries and mutations have a wrapper `needsAuthorization()` that ensures the logged in user has the correct permissions assigned to their account to access an object.

```py
@query.field("getRoles")
@needsAuthorization([Permissions.ROLE_READ])
async def resolve_get_role(
    obj=None,
    info: GraphQLResolveInfo = None
):
    async with db.acquire(reuse=False) as conn:
        roles_query = db.select([Role])
        roles = await conn.all(roles_query)
    return roles
```

If the logged in user is authorized to view roles (has ROLE_READ permission), it will return a list of roles. If the user does not have the required scope, it will raise a `GraphQLError` exception.

## Index

[Queries](gql/queries.md)  
[Mutations](gql/mutations.md)  
[Subscriptions](gql/subscriptions.md)  
[Types](gql/types.md)  
[Scalars](gql/scalars.md)
