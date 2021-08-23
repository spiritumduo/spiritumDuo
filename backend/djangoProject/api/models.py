from django.db import models
from django.utils.translation import gettext as _

class patient(models.Model):
    firstName = models.CharField(_('First name'), max_length=80, null=True)
    lastName = models.CharField(_('Last name'), max_length=80, null=True)
    hospitalNumber = models.CharField(_('Hospital number'), max_length=20, unique=True, null=True)
    nationalPatientNumber = models.CharField(_('NHS number'), max_length=20, unique=True, null=True)
    DOB = models.DateField(_('Date of birth'))
    createdOn = models.DateTimeField(auto_now_add=True)
    
    # class Meta:
    #     ordering = ['lastName', 'DOB']
    #     verbose_name = _('Patient information')
    
    # def __str__(self):
    #     return f'{self.firstName} {self.lastName}'
    
    # def get_absolute_url(self):
    #     return reverse('model-detail-view', args = [str(self.id)])

    # def dictionary(self):
    #     return to_dict(self)