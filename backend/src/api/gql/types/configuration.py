from ariadne import gql
type_defs=gql("""
    type Configuration {
        hospitalNumberName: String!
        hospitalNumberRegex: String!
        nationalPatientNumberName: String!
        nationalPatientNumberRegex: String!
    }
""")