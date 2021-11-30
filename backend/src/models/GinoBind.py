from gino import Gino

db=Gino()

db.set_bind("postgresql://postgres:postgres@sd-postgres:5432/starlette")
