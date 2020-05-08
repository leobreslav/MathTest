from rest_framework import serializers

from api.models import ProblemPrototype


class ProblemPrototypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemPrototype
        fields = ['id', 'name']
