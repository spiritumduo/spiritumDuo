from rest_framework import routers
from .api import patientViewSet

router = routers.DefaultRouter()
router.register('patient', patientViewSet, 'patient')

urlpatterns = router.urls