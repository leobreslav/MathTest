from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseBadRequest

from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import ProblemPrototype, ProblemHead
from api.serializers import ProblemPrototypeSerializer, ProblemHeadSerializer, UserSerializer


# Create your views here.


class ProblemPrototypes(APIView):
    # for POST requests to work (disables cookie)
    # @csrf_exempt
    # def dispatch(self, request, *args, **kwargs):
    #     return super(ProblemPrototypes, self).dispatch(request, *args, **kwargs)

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


def problem_heads(request, id=-1):
    if id != -1:
        heads = ProblemHead.objects.filter(prototype=id)
    else:
        heads = ProblemHead.objects.all()
    serializer = ProblemHeadSerializer(heads, many=True)
    return JsonResponse(serializer.data, safe=False)


def users(request):
    data = User.objects.all()
    serializer = UserSerializer(data, many=True)
    return JsonResponse(serializer.data, safe=False)
