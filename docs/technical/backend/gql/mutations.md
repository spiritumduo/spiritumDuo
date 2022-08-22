# GraphQL

## Mutations

Mutations typically return payload objects. This is an object that will include the new/updated object and a `UserErrors` object.

```gql
type UserError {
    message: String!
    field: String!
}

type AddPatientPayload {
    patient: Patient
    userErrors: [UserError!]
}
```

```py
@dataclass
class BaseMutationPayload:
    user_errors: Optional[List[MutationUserError]] = None


@dataclass
class PatientPayload(BaseMutationPayload):
    patient: Union[Patient, None] = None
```

Mutations should take an input type that contains all of the fields required.

For example:

```gql
createPathway(input: PathwayInput!): AddPathwayPayload!

input PathwayInput{
    name: String!
    clinicalRequestTypes: [ClinicalRequestTypeInput!]
}
```

With the query

```gql
createPathway(input: {name: 'test pathway'}){
    pathway{
        id
        name
    }
    userErrors{
        field
        message
    }
}
```

### User errors

`UserErrors` is a field that holds a list of errors derived from user inputs. For example, an input not meeting a regex spec, or creating a pathway with the name of a pathway that already exists.

```gql
type UserError {
    message: String!
    field: String!
}

type AddPathwayPayload {
    pathway: Pathway
    userErrors: [UserError!]
}
```

Using the query

```gql
{
    createPathway(input: {id: '1', name: 'test pathway'}){
        pathway{
            id
            name
        }
        userErrors{
            field
            message
        }
    }
}
```

A successful pathway creation mutation should look like

```json
{
    pathway: {id: '1', name: 'test pathway'},
    userErrors: null
}
```

An unsuccessful pathway creation mutation should look like

```json
{
    pathway: null,
    userErrors: [
        {field: 'name', message: 'a pathway with this name already exists'},
    ]
}
```
