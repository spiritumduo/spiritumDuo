from .db import db


class Patient(db.Model):
    __tablename__ = "patient"

    id = db.Column(db.Integer(), primary_key=True)
    hospital_number = db.Column(db.String())
    national_number = db.Column(db.String())
    communication_method = db.Column(db.String())
    first_name = db.Column(db.String())
    last_name = db.Column(db.String())
    date_of_birth = db.Column(db.Integer())
