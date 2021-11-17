from ariadne import gql
type_defs=gql("""
    type Patient{
        id: ID!
        firstName:String!
        lastName:String!
        communicationMethod:String! # this needs to be an enum
        hospitalNumber:Int!
        nationalNumber:Int!
        dateOfBirth:Date!
    }
""")