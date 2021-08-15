from rest_framework import routers
from .api import patientViewSet

router = routers.DefaultRouter()
router.register('api/webApp', patientViewSet, 'patient')

urlpatterns = router.urls