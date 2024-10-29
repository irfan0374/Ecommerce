from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from django.contrib.auth.models import User
from authentication.serializer import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth import logout as django_logout
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class RegistrationApi(CreateAPIView):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    permission_classes = [AllowAny]
    
    def perfrom_create(self,serializer): 
        serializer.save()
         
        return Response(status=status.HTTP_201_CREATED)


class LoginApi(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        User = get_user_model() 
        
        try:
            user = User.objects.get(email=email)  
        except User.DoesNotExist:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        if user.check_password(password):
            token = AccessToken.for_user(user) 
            
            
            data = {
                "username": user.username,
                "token": str(token), 
                "is_superuser": user.is_superuser 
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self,request):
     print("logout")

