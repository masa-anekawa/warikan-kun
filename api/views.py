from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from .serializers import UserSerializer, GroupSerializer, ConsumerSerializer, PaymentSerializer
from .models import Payment


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.get(name='consumer').user_set.all()
    serializer_class = ConsumerSerializer
