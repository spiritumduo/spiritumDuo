from datetime import date
from django.test import TestCase
from graphql import graphql_sync, graphql
from api.models import Pathway, Patient
from api.gql.schema import schema
from ariadne_django.tests.graphql_query_test import BaseGraphQLQueryTest
import json

patient_hospital_number="MRN1948202"
patient_national_number="9864681041"
patient_communication_method="LETTER"
patient_first_name="JOHN"
patient_last_name="DOE"
patient_date_of_birth="2000-01-01"
pathway_name="Demo pathway"

class PatientTest(BaseGraphQLQueryTest):
    def setUp(self):
        self.patient_hospital_number:str="MRN1948202"
        self.patient_national_number:str="9864681041"
        self.patient_communication_method:str="LETTER"
        self.patient_first_name:str="JOHN"
        self.patient_last_name:str="DOE"
        self.patient_date_of_birth:date="2000-01-01"
        self.pathway_name:str="Demo pathway"

    def test_create_pathway(self):
        self.create_pathway_query="""
            mutation createPathway($name:String!){
                createPathway(input:{
                    name:$name
                }){
                    pathway{
                        id
                        name
                    }
                    userErrors{
                        field
                        message
                    }
                }
            }
        """

        create_pathway_result=self.query(
            query=self.create_pathway_query,
            variables={
                "name":self.pathway_name
            }
        )
        create_pathway_result_content=json.loads(create_pathway_result.content)
        print(create_pathway_result_content)

        
    # def test_get_patient(self):
    #     self.get_patient="""
    #         query getPt($id:ID!){
    #             getPatient(id:$id){
    #                 id
    #                 firstName
    #                 lastName
    #                 hospitalNumber
    #                 nationalNumber
    #                 dateOfBirth
    #             }
    #         }
    #     """

    #     graphql_result=self.query(
    #         query=self.get_patient,
    #         variables={
    #             "id":self.patient.id
    #         }
    #     )
    #     content=json.loads(graphql_result.content)
    #     print(content)




# class GraphQLTest(TestCase):
#     def setUp(self):
#         self.patient=Patient(
#             hospital_number=patient_hospital_number,
#             national_number=patient_national_number,
#             communication_method=patient_communication_method,
#             first_name=patient_first_name,
#             last_name=patient_last_name,
#             date_of_birth=patient_date_of_birth,
#         )
#         self.patient.save()
#         self.assertEqual(self.patient.hospital_number, patient_hospital_number)
#         self.assertIsNotNone(self.patient.id)

    # def test_get_patient(self):
    #     self.get_patient="""
    #         query getPt($hospitalNumber:String!){
    #             getPatient(hospitalNumber:$hospitalNumber){
    #                 id
    #                 firstName
    #                 lastName
    #                 hospitalNumber
    #                 nationalNumber
    #                 dateOfBirth
    #             }
    #         }
    #     """

    #     graphql_result=BaseGraphQLQueryTest.query(
    #         query=self.get_patient,
    #         variables={
    #             "hospitalNumber":patient_hospital_number
    #         }
    #     )
    #     content=json.loads(graphql_result.content)
    #     print(content)

        # graphql_result=graphql_sync(
        #     schema=schema, source=self.create_pathway, variable_values={
        #         "name":self.pathway_name
        #     }
        # )
        # print(graphql_result)

    # def test_create_patient(self):
    #     self.create_mutation="""
    #         mutation newPt (
    #             $hospitalNumber:String!
    #             $nationalNumber:String!
    #             $communicationMethod:PatientCommunicationMethods!                
    #             $firstName:String!
    #             $lastName:String!
    #             $dateOfBirth:Date!
    #             $pathway:Int!            
    #         ){
    #             createPatient(input:{
    #                 hospitalNumber:$hospitalNumber,
    #                 nationalNumber:$nationalNumber,
    #                 communicationMethod:$communicationMethod,
    #                 firstName:$firstName,
    #                 lastName:$lastName,
    #                 dateOfBirth:$dateOfBirth,
    #                 pathway:$pathway
    #             }){
    #                 patient{
    #                     id
    #                     firstName
    #                     lastName
    #                     hospitalNumber
    #                     nationalNumber
    #                     dateOfBirth
    #                 }
    #                 userErrors{
    #                     field
    #                     message
    #                 }
    #             }
    #         }
    #     """

    #     graphql_result = graphql_sync(
    #         schema, self.create_mutation, variable_values={
    #             "hospitalNumber":self.patient_hospital_number,
    #             "nationalNumber":self.patient_national_number,
    #             "communicationMethod":self.patient_communication_method,
    #             "firstName":self.patient_first_name,
    #             "lastName":self.patient_last_name,
    #             "dateOfBirth":self.patient_date_of_birth,
    #             "pathway":self.pathway.id
    #         }
    #     )
    #     print(graphql_result)