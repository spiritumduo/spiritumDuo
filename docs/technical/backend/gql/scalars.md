# GraphQL

## Scalars

Scalars are value types. The scalar defintions define how a type should be parsed and serialized, including datetime and date.

```py
datetime_scalar = ScalarType("DateTime")

@datetime_scalar.serializer
def serialize_date_time(value):
    return value.isoformat()


@datetime_scalar.value_parser
def parse_datetime_value(value):
    return dateparser.parse(value)
```
