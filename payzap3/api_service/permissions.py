from rest_framework import permissions
from api_service.models import Transactions

class canUpdateTransaction(permissions.BasePermission):
    """
        Permission to check whetehr user can update a transaction or not
        User should be either lender or reciever
    """
    def has_permission(self, request, view):
        if 'pk' not in view.kwargs:
            return False
        pk = view.kwargs.get('pk')
        transaction = Transactions.objects.filter(id=pk).first()
        return request.user.username in [transaction.transaction_from.username, transaction.transaction_with.username]
        