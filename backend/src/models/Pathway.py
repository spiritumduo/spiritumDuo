from . import db

class Pathway(db.Model):
    __tablename__ = "pathway"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
