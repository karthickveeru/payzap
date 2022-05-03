import uuid
from django.db import models
from djmoney.models.fields import MoneyField
from django.contrib.auth.models import User

# Create your models here.



class Transactions(models.Model):
    """
        Data model for transaction among users
    """
    TYPE_CHOICE = (('lend', 'Lend'), ('borrow', 'Borrow'))
    STATUS_CHOICE = (('settled', 'Paid'),('pending', 'Pending'))
    PENDING = 'Pending'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_type = models.CharField(max_length=6, choices=TYPE_CHOICE)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=6, choices=TYPE_CHOICE, default=PENDING)
    transaction_from = models.ForeignKey('auth.User',on_delete=models.CASCADE, related_name='sent_from', null=True )
    transaction_with =models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='received_by', null=True)
    reason = models.CharField(max_length=150, null=True, blank=True)
    amount = MoneyField(max_digits=14, decimal_places=2, default_currency='USD', default=0.00, blank=False)

