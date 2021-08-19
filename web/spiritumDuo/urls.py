
from django.contrib import admin
from django.urls import path, include
import os

djangoBasic = os.getenv('djangoBasic')

appPath = 'app'

if djangoBasic == 'True':
    urlpatterns = [
        path(f'{ appPath }/', include('testApp.urls')),
    ]
else:
    urlpatterns = [
        path(f'{ appPath }/', include('frontend.urls')),
        path(f'{ appPath }/', include('webApp.urls')),
        path(f'{ appPath }/admin/', admin.site.urls),
        path(f'{ appPath }/test/', include('testApp.urls')),
    ]

