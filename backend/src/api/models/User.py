from django.db import models


class User(models.Model):
    firstName = models.TextField()
    lastName = models.TextField()
    userName = models.TextField()
    passwordHash = models.TextField()
    department = models.TextField()
    lastAccess = models.DateTimeField()
