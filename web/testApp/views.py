from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    print('here')
    return HttpResponse('Hello, World! <br> To be the front page of Spiritum Duo app <br> More to come')

def handler404(request, exception):
    return render(request, '404.html', status=404)
def handler500(request):
    return render(request, '500.html', status=500)