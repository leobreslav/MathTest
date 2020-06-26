from functools import partial
from django.contrib.auth.models import User
from django.http import HttpResponseBadRequest
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
from api.logic import generate_test_item
from api.models import ProblemPrototype, ProblemHead, TestItem, TestTemplate, Profile, ProblemHeadItem, ProblemPointItem
from api.serializers import ProblemPrototypeSerializer, ProblemHeadSerializer, ProblemPointItemSerializer, TestItemSerializer, UserSerializer, TemplateSerializer, \
    ProblemItemSerializer, TestSerializer, TestItemSerializer

from .decorators import catch_errors
from .exceptions import NotAllowedException, BadRequestException
from .logic import get_data, get_model, generate_test_template
# Create your views here.


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
def problem_heads(request, id=-1):
    if id != -1:
        heads = ProblemHead.objects.filter(prototype=id)
    else:
        heads = ProblemHead.objects.all()
    serializer = ProblemHeadSerializer(heads, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
def users(request):
    data = User.objects.all()
    serializer = UserSerializer(data, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
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


@api_view(["POST"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
@catch_errors
def generate_template(request):
    name, prototypes = get_data(request, "data", {
        "name": str,
        "prototype_ids": partial(get_model, ProblemPrototype, many=True)
    })
    author = request.user.profile

    generate_test_template(author, name, *prototypes)
    return Response(status=201)


@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
def generate_test(request):
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
    return Response({"item_id": test_item.id})

@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
@catch_errors
def get_test(request):
    item, = get_data(request, 'GET', {
        "id": partial(get_model, TestItem)
    })
    return Response(TestSerializer(item).data)


class PointItem(APIView):
    authentication_classes = [TokenAuthSupportCookie]
    permission_classes = [IsAuthenticated]

    @catch_errors
    def get(self, request):
        point_item, = get_data(request, "GET", {"id": partial(get_model, ProblemPointItem)})
        return Response(ProblemPointItemSerializer(point_item).data)

    @catch_errors
    def put(self, request):
        point_item, answer = get_data(
            request,
            "data",
            {
                "id": partial(get_model, ProblemPointItem),
                "answer": None,
            }
        )
        point_item.answer = answer
        point_item.is_answered = True
        point_item.save()
        return Response(ProblemPointItemSerializer(point_item).data)


@api_view(["POST"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
@catch_errors
def check_test_point(request):
    pp_item_id, score, comment = get_data(request, 'POST', {"point_id": int, "score": int, "comment": str})

    pp_item = get_model(ProblemPointItem, pp_item_id)
    user_id = pp_item.problem_item.test.template.author.user_id
    if user_id != request.user.id:
        raise NotAllowedException("You are not allowed to check this test")

    if not pp_item.is_answered:
        raise BadRequestException("This point has not been answered yet, nothing to check")

    pp_item.score = score
    pp_item.comment = comment
    pp_item.save()

    return Response(ProblemPointItemSerializer(pp_item).data)


@api_view(["GET"])
@authentication_classes([TokenAuthSupportCookie])
@permission_classes([IsAuthenticated])
def tests(request):
    profile = Profile.objects.filter(user_id=request.user.id)
    if len(profile) != 1:
        return Response(status=400)

    items = TestItem.objects.filter(student_id=profile[0].id)
    return Response(TestSerializer(items, many=True).data)
