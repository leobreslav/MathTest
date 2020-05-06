from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

from api.models import ProblemPrototype
from api.serializers import ProblemPrototypeSerializer


# Create your views here.


class ProblemPrototypes(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(ProblemPrototypes, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        prototypes = ProblemPrototype.objects.all()
        serializer = ProblemPrototypeSerializer(prototypes, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = ProblemPrototypeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
