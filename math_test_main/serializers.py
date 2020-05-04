from rest_framework import serializers

from math_test_main.models import ProblemPrototype


class ProblemPrototypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemPrototype
        fields = ['id', 'name']
