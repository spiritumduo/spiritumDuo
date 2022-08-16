# GraphQL API

## Overview

[GraphQL](https://graphql.org/) is a query language for APIs. Clients can select the data they need based on their requirements and permissions. GraphQL modelling uses [graph theory]
(https://www.tutorialspoint.com/graph_theory/graph_theory_fundamentals.htm). In this project, this means that from a `Patient` object, you can get their pathways, test requests, etc, all in one query.
  
GraphQL APIs are better because

- we can reuse queries
- the queries don't need to be changed when the client's requirements change
- queries are more optimised because [under/overfetching](https://stackoverflow.com/questions/44564905/what-is-over-fetching-or-under-fetching) is not a problem
  
RESTful APIs are better because

- the server has more control over the data given to the client
- REST uses HTTP caching automatically
- supports API versioning

## Index

[Queries](queries.md)  
[Subscriptions](subscriptions.md)  
[Types](types.md)
