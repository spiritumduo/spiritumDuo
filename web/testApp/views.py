from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    print('here')
    return HttpResponse('Hello, World! <br> To be the front page of Spiritum Duo app <br> More to come')
