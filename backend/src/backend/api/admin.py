from django.contrib import admin
from backend.api.models import Patient, User, Configuration, DecisionPoint, TestResult

# Register your models here.
admin.site.register(Patient)
admin.site.register(User)
admin.site.register(Configuration)
admin.site.register(DecisionPoint)
admin.site.register(TestResult)




