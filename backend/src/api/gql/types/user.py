from ariadne import gql
type_defs=gql("""
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        userName: String!
        password: String
        department: String!
        lastAccess: Date!
        roles: [Role!]
    }
""")