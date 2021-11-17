from ariadne import gql
type_defs=gql("""
    type Role{
        id: ID
        name: String
    }
""")