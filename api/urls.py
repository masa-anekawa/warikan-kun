from rest_framework import routers
from .views import UserViewSet, GroupViewSet, PaymentViewSet, ConsumerViewSet

router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'groups', GroupViewSet)
router.register(r'consumers', ConsumerViewSet)
router.register(r'payments', PaymentViewSet)
