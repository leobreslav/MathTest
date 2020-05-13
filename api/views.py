from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import ProblemPrototype, ProblemHead, TestTemplate, Profile
from api.serializers import ProblemPrototypeSerializer, ProblemHeadSerializer, UserSerializer, TemplateSerializer


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
        return HttpResponse(status=403)

    author_id = author.get().id
    # author_id = request.GET['author_id']
    templates = TestTemplate.objects.filter(author_id=author_id)
    serializer = TemplateSerializer(templates, many=True)
    return JsonResponse(serializer.data, safe=False)
    # return HttpResponseBadRequest()

