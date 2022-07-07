from .db import db
from sqlalchemy import Enum
from RecordTypes import Sex


class Patient(db.Model):
    __tablename__ = "tbl_patient"

    id = db.Column(db.Integer(), primary_key=True)
    hospital_number = db.Column(db.String(), nullable=False, unique=True)
    national_number = db.Column(db.String(), nullable=False, unique=True)
    communication_method = db.Column(db.String(), nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    date_of_birth = db.Column(db.Date(), nullable=False)
    sex = db.Column(Enum(Sex), nullable=False)
    address_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_address.id'), unique=False)
    occupation = db.Column(db.String(), nullable=False)
    telephone_number = db.Column(db.String(), nullable=True)
