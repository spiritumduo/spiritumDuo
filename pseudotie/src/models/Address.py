from models.db import db
from sqlalchemy import UniqueConstraint


class Address(db.Model):
    __tablename__ = "tbl_address"
    __table_args__ = (
        UniqueConstraint(
            "id",
            "line",
            "city",
            "district",
            "postal_code",
            "country",
        )
    )

    id = db.Column(db.Integer(), primary_key=True)
    line = db.Column(db.String(), nullable=False)
    city = db.Column(db.String(), nullable=False)
    district = db.Column(db.String(), nullable=False)
    postal_code = db.Column(db.String(), nullable=False)
    country = db.Column(db.String(), nullable=False)
