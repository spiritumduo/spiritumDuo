# Models

Models are schemas for objects that are stored in the database. [Gino](https://github.com/python-gino/gino) is an ORM built on SQLAlchemy core. Using Gino we can create database models and easily access them.

```py
class Patient(Gino.model):
    __tablename__ = 'tbl_patient'

    id = db.Column(db.Integer(), primary_key=True)
    hospital_number = db.Column(db.String(), nullable=False, unique=True)
    national_number = db.Column(db.String(), nullable=False, unique=True)
```

Because Gino handles the models, we can run queries using the classes directly.

```py
    patient: Patient = await Patient.get(int(id))
    await patient.delete()
```

```py
    patient: Patient = await Patient.query.where(
        Patient.id == patient_id_to_find
    ).gino.one_or_none()
```

This is great because we don't need to run raw SQL queries, however the syntax can take getting used to. For much more complex queries, it's sometimes easier to write the raw SQL query and convert that into Gino's syntax.

One issue with Gino is the maintenance of the database pool. We may have to reaquire a database connection as it may attempt to run a query on a connection that is no longer available.

```py
    async with self._db.acquire(reuse=False) as conn:
        query = OnPathway.query.where(OnPathway.id.in_(keys))
        result: List[OnPathway] = await conn.all(query)
```
