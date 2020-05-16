from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.logic import generate_test_item
from api.models import ProblemPrototype, ProblemHead, TestTemplate, Profile, ProblemHeadItem
from api.serializers import ProblemPrototypeSerializer, ProblemHeadSerializer, UserSerializer, TemplateSerializer, \
    ProblemHeadItemSerializer


# Create your views here.


class ProblemPrototypes(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prototypes = ProblemPrototype.objects.all()
        serializer = ProblemPrototypeSerializer(prototypes, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            data = request.data
        except KeyError:
            return HttpResponseBadRequest()
        serializer = ProblemPrototypeSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def problem_heads(request, id=-1):
    if id != -1:
        heads = ProblemHead.objects.filter(prototype=id)
    else:
        heads = ProblemHead.objects.all()
    serializer = ProblemHeadSerializer(heads, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def users(request):
    data = User.objects.all()
    serializer = UserSerializer(data, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_templates(request):
    user_id = request.user.id
    author = Profile.objects.filter(user_id=user_id)

    if len(author) == 0 or not author.get().has_access:
        return Response(status=403)

    author_id = author.get().id
    templates = TestTemplate.objects.filter(author_id=author_id)
    serializer = TemplateSerializer(templates, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_test(request):
    user_id = request.user.id
    student = Profile.objects.filter(user_id=user_id)

    if len(student) == 0:
        return Response(status=403)
    if 'template_id' not in request.GET:
        return Response(status=400)

    student = student.get()
    template_id = request.GET['template_id']
    template = TestTemplate.objects.get(id=template_id)

    test_item = generate_test_item(template, student)
    head_items = ProblemHeadItem.objects.filter(test=test_item)
    serializer = ProblemHeadItemSerializer(head_items, many=True)
    return Response(serializer.data)
