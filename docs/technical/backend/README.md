# Backend documentation

## Overview

The current backend is running the [ASGI](https://asgi.readthedocs.io/en/latest/) framework [Starlette](https://www.starlette.io/), using [Ariadne](https://ariadnegraphql.org/) as a [GraphQL](https://graphql.org/) server ([project docs here](graphql.md)). The RESTful APIs are running on [FastAPI](https://fastapi.tiangolo.com/). The project is also using an ORM, [Gino](https://github.com/python-gino/gino) ([project docs here](database.md)).
  
The reasons for which GraphQL and RESTful APIs have been chosen are in the [GraphQL docs](graphql.md) and [RESTful API docs](rest.md).

TODO: put GQL/REST reasons here, general design choice

## History

Initially the project started with [Django](https://www.djangoproject.com/) and [Graphene](https://graphene-python.org/)/[Graphene-Django](https://github.com/graphql-python/graphene-django).
  
When we started to integrate dataloaders, we ran into concurrency issues as the data loaders and our ORM were asynchronous. We migrated from Django (WSGI) to Starlette (ASGI).  
We then has issues with Graphene as it was synchronous. We figured we could try to fix the issue we had wrt asynchrony and accept that we may run into similar issues in the future, or we could move to another GraphQL server implementation. We decided to move to Ariadne from Graphene. This is because at the time, although Graphene had a new revision coming soon that fully supported asynchrony, it was quite unmaintained.

TODO: end bit needs rewording

## Index

[Alembic](alembic.md)  
[Authentication](authentication.md)  
[Database](database.md)  
[Data creators](data_creators.md)  
[Data loaders](data_loaders.md)  
[Data updaters](data_updaters.md)  
[GraphQL API](graphql.md)  
[Manage scripts](manage_scripts.md)  
[RESTful APIs](rest.md)  
[Testing](testing.md)  
[Trust adapter](trust_adapter.md)  
