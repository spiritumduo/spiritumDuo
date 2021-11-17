from django.urls import path
from ariadne_django.views import GraphQLAsyncView
from api.gql.schema import schema

urlpatterns = [
    path('', GraphQLAsyncView.as_view(schema=schema), name='graphql')
]