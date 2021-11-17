from ariadne import MutationType, gql

type_defs = gql(
    """
    type Mutation
    """
)

mutation = MutationType()