from rest_framework import serializers
from api_service.models import Transactions
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class TransactionWriteSerializer(serializers.ModelSerializer):
    transaction_with = serializers.CharField(max_length=100)

    def validate(self, attrs):
        transaction_receiver = attrs.get('transaction_with')
        if not User.objects.filter(username=transaction_receiver).exists() or self.context['request'].user.username == transaction_receiver:
            raise serializers.ValidationError("Invalid Receiver", code='Invalid Receiver')
        return attrs


    class Meta:
        model = Transactions
        fields = ( 'reason', 'status', 'transaction_type', 'amount', 'transaction_with', 'id')
        extra_kwargs = {'amount': {'required': True}, 'transaction_with':{'required': True}} 
    

class TransactionRetrieveSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields =  '__all__'


class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields used for authentication: username and password.
    It will try to authenticate the user with username/password when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},  
        write_only=True
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        print(f'---> {username} {password}')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs
class TransactionStatusSerializer(serializers.Serializer):
    class Meta:
        model = Transactions
        fields = ('status',)
        extra_kwargs = {'status': {'required': True}} 
