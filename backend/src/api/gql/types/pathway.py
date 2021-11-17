from ariadne import gql
type_defs=gql("""
    type Pathway {
        id: ID!
        name: String!
    }
""")