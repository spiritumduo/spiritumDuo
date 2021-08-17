from django.shortcuts import render

def index(request):
  return render(request, 'frontend/index.html')

def handler404(request, exception):
    return render(request, '404.html', status=404)
def handler500(request):
    return render(request, '500.html', status=500)