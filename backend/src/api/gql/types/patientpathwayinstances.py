from ariadne import gql
type_defs=gql("""
    type PatientPathwayInstances{
        id: ID!
        patient:Patient!
        pathway:Pathway!
        is_discharged:Boolean!
        awaiting_decision_type:String!
    }
""")