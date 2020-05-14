from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseBadRequest

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import ProblemPrototype, ProblemHead, TestTemplate
from api.serializers import ProblemPrototypeSerializer, ProblemHeadSerializer, UserSerializer

from rest_framework.decorators import api_view, authentication_classes, permission_classes

from functools import partial

from api.decorators import get_model, requires_params
from api.logic import generate_test_template


class TokenAuthSupportCookie(TokenAuthentication):
    """
    Extend the TokenAuthentication class to support cookie based authentication
    """

    def authenticate(self, request):
        if 'auth_token' in request.COOKIES and \
                        'HTTP_AUTHORIZATION' not in request.META:
            return self.authenticate_credentials(
                request.COOKIES.get('auth_token')
            )
        return super().authenticate(request)


class ProblemPrototypes(APIView):
    authentication_classes = [TokenAuthSupportCookie]
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
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
def problem_heads(request):
    heads = ProblemHead.objects.all()
    serializer = ProblemHeadSerializer(heads, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
@get_model(ProblemHead, "id", fun="filter", field="prototype")
def problem_head_by_prototype(request, id):
    serializer = ProblemHeadSerializer(id, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
def users(request):
    data = User.objects.all()
    serializer = UserSerializer(data, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
@requires_params(
    "data",
    {
        "task_prototypes": partial(map, int),
        "name": str,
        }
    )
@get_model(ProblemPrototype, "task_prototypes", many=True)
def create_template(request, task_prototypes, name):
    generate_test_template(request.user.profile, name, *task_prototypes)
    return Response(status=201)
