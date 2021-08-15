from webApp.models import patient
from rest_framework import viewsets, permissions
from .serializers import patientSerializer

# patient Viewset
class patientViewSet(viewsets.ModelViewSet):
    queryset = patient.objects.all()
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = patientSerializer