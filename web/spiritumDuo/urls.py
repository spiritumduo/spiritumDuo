
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('webApp.urls')),
    path('admin/', admin.site.urls),
    path('test/', include('testApp.urls')),
]
