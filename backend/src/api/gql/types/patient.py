from ariadne import gql
from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from typing import List

from api.models import PatientPathwayInstances

type_defs=gql("""
    enum PatientCommunicationMethod{
        LETTER
        EMAIL
        LANDLINE
        MOBILE
    }
    type Patient{
        id: ID!
        firstName:String!
        lastName:String!
        communicationMethod:PatientCommunicationMethod!
        hospitalNumber:Int!
        nationalNumber:Int!
        dateOfBirth:Date!

        # from other data sources (related objects)
        pathwayInstances:[PatientPathwayInstances]
        decisionPoints:[DecisionPoint]
        testResults:[TestResult]
    }
""")

PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("pathwayInstances")
async def resolve_patient_pathway_instances(obj=None, *_):
    if not obj:
        return None
    print("Hello, world!")
    pathwayInstances=await database_sync_to_async(PatientPathwayInstances.objects.select_related)("patient")
    patientPathwayInstances=await pathwayInstances.filter(patient=obj.id)
    print(patientPathwayInstances)
    return patientPathwayInstances