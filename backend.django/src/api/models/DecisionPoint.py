from django.db import models
from django.utils.translation import gettext_lazy as _
from .Patient import Patient
from .Pathway import Pathway
from .UserProfile import SdUser

class DecisionPoint(models.Model):
    class DecisionPointType(models.TextChoices):
        TRIAGE = "TRIAGE", _("Triage")
        CLINIC = "CLINIC", _("Clinic")
        MDT = "MDT", _("MDT")
        AD_HOC = "AD_HOC", _("Ad-Hoc")
        FOLLOW_UP = "FOLLOW_UP", _("Follow up")
    patient=models.ForeignKey(Patient, on_delete=models.CASCADE)
    clinician=models.ForeignKey(SdUser, on_delete=models.CASCADE)
    pathway=models.ForeignKey(Pathway, on_delete=models.CASCADE)
    decision_type=models.CharField(
        choices=DecisionPointType.choices,
        default=DecisionPointType.TRIAGE,
        max_length=10,
    )
    added_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    clinic_history=models.TextField()
    comorbidities=models.TextField()
    requests_referrals=models.TextField()