# Backend
Backend application server for Spiritum Duo
## Migration
To perform a migration run the commands:
```
alembic revision -m "first migration" --autogenerate --head head
alembic upgrade head
```
This is required on initial install and after and updates to the data models