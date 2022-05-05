from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics
from api_service.serializers import (
    TransactionWriteSerializer, 
    TransactionRetrieveSerialzer, 
    LoginSerializer, 
    TransactionStatusSerializer,
    UserSerializer
)
from api_service.models import User, Transactions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from django.contrib.auth import login, logout
from django.db import transaction
from django.contrib.auth.models import User
from .permissions import canUpdateTransaction


# Create your views here.
class Login(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data, context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(None, status=status.HTTP_200_OK)

class Logout(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)



class CreateTransaction(generics.CreateAPIView):
    serializer_class = TransactionWriteSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        transaction_receiver = self.request.data.get('transaction_with')
        try:
            print(self.request.data)
            transaction_receiver_user_object = User.objects.filter(username = transaction_receiver).first()
            transaction_sender_user_object = self.request.user
        except Exception as error:
            return Response(status=status.HTTP_400_BAD_REQUEST, error={}) 
        serializer.save(transaction_from=transaction_sender_user_object, transaction_with=transaction_receiver_user_object )

class RetrieveTransaction(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionRetrieveSerialzer
    queryset = Transactions.objects.all()
    

class ListUserTransaction(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionRetrieveSerialzer
    def get_queryset(self):
        user = User.objects.filter(username=self.kwargs.get('user')).first()
        return Transactions.objects.filter(Q(transaction_with=user) | Q(transaction_from=user))

class PostTransactionStatus(APIView):
    permission_classes = [IsAuthenticated]
    permission_classes = (canUpdateTransaction,)
    def post(self, request, pk):
        try:
            with transaction.atomic():
                record = Transactions.objects.filter(id=pk).first()
                if record.status == 'settled':
                    raise ValueError('Transaction already settled')
                record.status = 'settled'
                record.save()
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)
       
        return Response(status=status.HTTP_202_ACCEPTED)

class ListUsers(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return User.objects.exclude(Q(is_superuser=True) | Q(username = self.request.user.username))

