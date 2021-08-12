from django.conf.urls import url
from . import views

urlpatterns = [url(''r'^$', views.index, name='index')]
'''
viewsList = [
            'triage',
            'clinic',
            'MDT',
            'adhoc',
            'results',
            'pathway',
            'newPatient',
            'patientView',
            'confirmNewPatient',
            'invalidSearch',
            'PDFTest',
            'ice'
]


for viewSingle in viewsList:
    urlpatterns.append(url(viewSingle, getattr(views, viewSingle), name=viewSingle))

urlpatterns.append(url(r'^pdf', views.pdf, name='pdf'))
'''