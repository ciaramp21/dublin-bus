from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from django.utils import timezone
from .models import *


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True
    )
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = AuthUser
        fields = ('first_name', 'last_name', 'fare_type', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        instance.password = make_password(password)
        instance.is_superuser = False
        instance.is_staff = False
        instance.is_active = True
        instance.date_joined = timezone.now()
        instance.save()
        return instance
