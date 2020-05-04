from django.http import JsonResponse
from django.shortcuts import render
from django.template import loader
from rest_framework.parsers import JSONParser

from math_test_main.models import ProblemPrototype
from math_test_main.serializers import ProblemPrototypeSerializer
# Create your views here.


# @csrf_exempt for POST requests
def problem_prototypes(request):
    """
    API: List all prototypes.
    """
    if request.method == 'GET':
        prototypes = ProblemPrototype.objects.all()
        serializer = ProblemPrototypeSerializer(prototypes, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = ProblemPrototypeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


def problem_prototypes_html(request):
    return render(request, "problem_prototypes.html")
