from gino import Gino

database=Gino()

database.set_bind("postgresql://localhost/postgres")