from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt  # TODO: This has to be removed in production

urlpatterns = [
    path('', csrf_exempt(GraphQLView.as_view(graphiql=True)))
]