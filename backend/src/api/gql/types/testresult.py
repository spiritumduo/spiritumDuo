from ariadne import gql
type_defs=gql("""
    type TestResult {
        id: ID!
        patient: Patient!
        pathway: Pathway!
        addedAt: Date!
        description: String!
        mediaUrls: [String]
    }
""")