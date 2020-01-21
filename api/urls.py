from rest_framework import routers
from .views import UserViewSet, GroupViewSet, PaymentViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'payments', PaymentViewSet)
