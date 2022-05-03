from django.urls import include, path
from api_service.views import CreateTransaction, RetrieveTransaction, ListUserTransaction, PostTransactionStatus, Login, Logout

urlpatterns = [
    path('transaction', CreateTransaction.as_view(), name='create_transaction'),
    path('transaction/<slug:pk>', RetrieveTransaction.as_view(), name='create_transaction'),
    path('transactions/<str:user>', ListUserTransaction.as_view(), name='list_user_transaction'),
    path('transaction/settle/<slug:pk>', PostTransactionStatus.as_view(), name='settle_transaction'),
    path('login', Login.as_view(), name='login'),
    path('logout', Logout.as_view(), name='logout')
]
