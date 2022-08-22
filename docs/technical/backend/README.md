# Backend documentation

## Overview

The current backend is running the [ASGI](https://asgi.readthedocs.io/en/latest/) framework [Starlette](https://www.starlette.io/), using [Ariadne](https://ariadnegraphql.org/) as a [GraphQL](https://graphql.org/) server ([project docs here](./graphql.md)). The RESTful APIs are running on [FastAPI](https://fastapi.tiangolo.com/). The project is also using an ORM, [Gino](https://github.com/python-gino/gino) ([project docs here](models.md)).

## Starting the backend

This is designed to run as a Docker container although it should work outside of Docker too. The backend requires a Postgres database server. The configuration of this can be found in the `.env` (backend/.env) file.
  
1. Ensure that prerequisites are installed:

    ```bash
    python3 -m pip install --upgrade pip && pip install -r backend/core/requirements.dev.txt
    ```

2. Run the backend script

    ```bash
    cd backend/src && uvicorn --host 0.0.0.0 --reload --port 8080 api:app
    ```

    The backend server will listen on port 8080.

    Information on [Uvicorn](https://github.com/encode/uvicorn) and its command line options can be found [here](https://www.uvicorn.org/#command-line-options).

## History

Initially the backend started with [Django](https://www.djangoproject.com/) and [Graphene](https://graphene-python.org/)/[Graphene-Django](https://github.com/graphql-python/graphene-django).
  
When we started to integrate dataloaders, we ran into concurrency issues as the data loaders are asynchronous. We migrated from Django (WSGI) to Starlette (ASGI).  
We then has issues with Graphene as it too was synchronous, and we wanted to use an ORM, [Gino](https://github.com/python-gino/gino). We figured we could try to fix the issue we had wrt asynchrony and accept that we may run into similar issues in the future, or we could move to another GraphQL server implementation. We decided to move to Ariadne from Graphene because, although there was a version that supported asyncrony, it was unmaintained.

## Index

[Alembic](alembic.md)  
[Authentication](authentication.md)  
[Data creators](data_creators.md)  
[Data loaders](data_loaders.md)  
[Data updaters](data_updaters.md)  
[Dependancy injection](./dependancy_injection.md)  
[GraphQL API](graphql.md)  
[Manage scripts](manage_scripts.md)  
[Modelling](./models.md)  
[RESTful APIs](rest.md)  
[Testing](testing.md)  
[Trust adapter](trust_adapter.md)  
