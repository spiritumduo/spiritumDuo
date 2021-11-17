from ariadne import gql
type_defs=gql("""
    enum DecisionPointType {
        TRIAGE
        CLINIC
        MDT
        AD_HOC
        FOLLOW_UP
    }
    type DecisionPoint {
        id: ID!
        patient: Patient!
        clinician: User!
        pathway: Pathway!
        addedAt: Date!
        updatedAt: Date
        decisionType: DecisionPointType!
        clinicHistory: String!
        comorbidities: String!
        requestsReferrals: String!
    }
""")