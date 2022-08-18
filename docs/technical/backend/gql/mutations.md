# GraphQL

## Mutations

Mutations typically return payload objects. This is an object that will include the new/updated object and a `UserErrors` object.

### User errors

`UserErrors` is a field that holds a list of errors derived from user inputs. For example, an input not meeting a regex spec, or creating a pathway with the name of a pathway that already exists.

Mutations should take an input type that contains all of the fields required.

For example:

```gql
updateOnMdt(input: UpdateOnMdtInput!): OnMdtPayload!

input UpdateOnMdtInput{
    id: ID!
    reason: String
    outcome: String
    order: Int
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
