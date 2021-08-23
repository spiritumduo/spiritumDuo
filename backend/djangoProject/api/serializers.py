from rest_framework import serializers
from .models import patient

# patient Serializer
class patientSerializer(serializers.ModelSerializer):
  class Meta:
    model = patient
    fields = '__all__'