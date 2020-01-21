from datetime import date
from django.contrib.auth.models import User
from django.db import models


class Payment(models.Model):
    paid_by = models.ForeignKey(User, related_name='payments', on_delete=models.CASCADE)
    paid_for = models.ManyToManyField(User, related_name='treats')
    amount = models.IntegerField()
    title = models.CharField(max_length=128)
    date = models.DateField(default=date.today)
    cleared = models.BooleanField(default=False)
