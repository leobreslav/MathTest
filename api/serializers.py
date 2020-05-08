from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import ProblemPrototype, ProblemHead, Profile


class ProblemPrototypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemPrototype
        fields = ['id', 'name']


class ProblemHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemHead
        fields = ['id', 'problem']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']
