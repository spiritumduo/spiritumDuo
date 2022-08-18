# GraphQL

## Mutations

Mutations typically return payload objects. This is an object that will include the new/updated object and a `UserErrors` object.

### User errors

`UserErrors` is a field that holds a list of errors derived from user inputs. For example, an input not meeting a regex spec, or creating a pathway with the name of a pathway that already exists.

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

A successful pathway creation mutation could look like

```gql
{
    pathway: {id: '1', name: 'test pathway'},
    userErrors: null
}
```

An unsuccessful pathway creation mutation could look like

```gql
{
    pathway: null,
    userErrors: [
        {field: 'name', message: 'a pathway with this name already exists'},
    ]
}
```
