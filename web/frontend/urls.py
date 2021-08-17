from django.urls import path
from . import views
from django.conf.urls import handler404, handler500, handler403, handler400

handler404 = views.handler404
handler500 = views.handler500

urlpatterns = [
  path('', views.index)
]