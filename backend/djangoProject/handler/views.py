from django.shortcuts import render

def index(request):
    return render(request, 'handler/index.html')

def handler404(request, exception):
    return render(request, 'handler/404.html', status=404)
def handler500(request):
    return render(request, 'handler/500.html', status=500)