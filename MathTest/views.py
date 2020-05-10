from django.http import HttpResponseNotFound
from django.shortcuts import render
from MathTest.settings import HAS_NGINX

def index(request):
    if HAS_NGINX:
        return HttpResponseNotFound()
    return render(request, "index.html")
