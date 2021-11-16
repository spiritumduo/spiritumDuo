from ariadne_django.views import GraphQLAsyncView
from django.urls import path
from .schema import schema
from .tmpschema import schema as tmpschema
from newapi.loaders import create_loaders

def get_context_value(request):
    return {
        'request': request,
        'loaders': create_loaders(),
        'something': "something"
    }


urlpatterns = [
    path('', GraphQLAsyncView.as_view(schema=schema), name='graphql'),
    path('tmp', GraphQLAsyncView.as_view(schema=tmpschema), name='tmp'),
]
