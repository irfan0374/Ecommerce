
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    

    class Meta:
        model = User
        fields = ["username", "email", "password1"]

    def create(self, validated_data):
        user = User.objects.create_user( 
            username=validated_data['username'],
            email=validated_data['email'], 
            password=validated_data['password1'] 
        ) 
        return user
    

