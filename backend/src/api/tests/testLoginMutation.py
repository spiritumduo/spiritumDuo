from graphene_django.utils.testing import GraphQLTestCase
from api.models import SdUser
import json


class TestLoginMutation(GraphQLTestCase):
    GRAPHQL_URL = "http://localhost/graphql"  # this makes it not 404

    def setUp(self):
        self.username="Bob"
        self.password="FromTesco"
        self.user = SdUser.objects.create_user(
            username=self.username,
            password=self.password
        )
        self.loginQuery = '''
            mutation login ($username: String!, $password: String!) {
                login (username: $username, password: $password) {
                    user {
                        id
                        firstName
                        lastName
                        username
                        department
                        lastAccess
                    }
                }
            }
            '''

    def testLogin(self):
        response = self.query(
            self.loginQuery,
            variables={
                'username': self.username,
                'password': self.password
            }
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        responseUsername = content['data']['login']['user']['username']
        self.assertEqual(self.username, responseUsername)