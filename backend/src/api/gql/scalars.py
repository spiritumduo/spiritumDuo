from ariadne import ScalarType

type_defs="""
    scalar Date
    scalar DateTime
"""

date_scalar = ScalarType("Date")
datetime_scalar=ScalarType("DateTime")

@date_scalar.serializer
def serialize_date(value):
    return value.isoformat()

@datetime_scalar.serializer
def serialize_date_time(value):
    return value.isoformat()

type_list = [date_scalar, datetime_scalar]