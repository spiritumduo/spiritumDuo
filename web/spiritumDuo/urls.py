
from django.contrib import admin
from django.urls import path, include

appPath = 'app'

urlpatterns = [
    path(f'{ appPath }/', include('frontend.urls')),
    path(f'{ appPath }/', include('webApp.urls')),
    path(f'{ appPath }/admin/', admin.site.urls),
    path(f'{ appPath }/test/', include('testApp.urls')),
]
