from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Payment


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'payments', 'treats']


class ConsumerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class PaymentSerializer(serializers.ModelSerializer):
    paid_by = ConsumerSerializer(read_only=True)
    # paid_for = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields =['paid_by', 'paid_for', 'amount', 'title', 'cleared']
