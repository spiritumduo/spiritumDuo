from ariadne import ScalarType
from dateutil import parser as dateparser

date_scalar = ScalarType("Date")
datetime_scalar = ScalarType("DateTime")


@date_scalar.serializer
def serialize_date(value):
    return value.isoformat()


@date_scalar.value_parser
def parse_date_value(value):
    # parse value into datetime, then extract date only
    return dateparser.parse(value).date()


@datetime_scalar.serializer
def serialize_date_time(value):
    return value.isoformat()


@datetime_scalar.value_parser
def parse_datetime_value(value):
    return dateparser.parse(value)


type_list = [date_scalar, datetime_scalar]
