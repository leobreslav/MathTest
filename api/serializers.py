from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import ProblemPrototype, ProblemHead, ProblemPoint, TestTemplate, TestItem, ProblemHeadItem, \
    ProblemPointItem


class ProblemPointSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProblemPoint
        fields = ['id', 'answer', 'num_in_problem']


class ProblemSerializer(serializers.ModelSerializer):
    problempoint_set = ProblemPointSerializer(many=True)

    class Meta:
        model = ProblemHead
        fields = ['id', 'problem', 'problempoint_set']


class ProblemPrototypeSerializer(serializers.ModelSerializer):
    example = ProblemSerializer(required=False)

    class Meta:
        model = ProblemPrototype
        fields = ['id', 'name', 'example']


class ProblemHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemHead
        fields = ['id', 'problem']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestTemplate
        fields = ['id', 'author', 'name']


class ProblemPointItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemPointItem
        fields = ['id', 'answer', 'score', 'comment', 'num_in_problem']


class ProblemItemSerializer(serializers.ModelSerializer):
    problem_head = ProblemHeadSerializer()
    points = ProblemPointItemSerializer(many=True)

    class Meta:
        model = ProblemHeadItem
        fields = ['id', 'index', 'problem_head', 'points']
