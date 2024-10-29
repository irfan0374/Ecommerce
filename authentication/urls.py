from django.urls import path
from .views import RegistrationApi, LoginApi

urlpatterns = [
    path('register/', RegistrationApi.as_view(), name='registration'),
    path('login/', LoginApi.as_view(), name='login'),
]
