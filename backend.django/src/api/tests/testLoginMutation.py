from django.test import TestCase
from graphql import graphql_sync
from api.gql.schema import schema
from api.models import SdUser, UserProfile
import json


class TestLoginMutation(TestCase):
    GRAPHQL_URL = "http://localhost/graphql/"

    def setUp(self):
        self.username = "John"
        self.password = "Doe"
        self.user = SdUser.objects.create_user(
            username=self.username,
            password=self.password
        )
        self.user.first_name = "John"
        self.user.last_name = "Doe"

        self.userProfile = UserProfile()
        self.userProfile.user = self.user
        self.userProfile.department = "Respiratory"

        self.user.save()
        self.userProfile.save()

        self.loginQuery = '''
            mutation login ($username: String!, $password: String!) {
                login (username: $username, password: $password) {
                    id
                    firstName
                    lastName
                    username
                    department
                    lastLogin
                }
            }
            '''

    def testLogin(self):
        response = graphql_sync(
            schema, self.loginQuery, variable_values={'username': self.username, 'password': self.password}
        )
        #  self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        responseUsername = content['data']['login']['user']['username']
        self.assertEqual(self.username, responseUsername)
        responseFirstName = content['data']['login']['user']['firstName']
        self.assertEqual(self.user.first_name, responseFirstName)
