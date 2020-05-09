from django.http import HttpResponseRedirect
from MathTest.settings import HAS_NGINX



def index(request):
    if HAS_NGINX:
        return HttpResponseRedirect("/react/index.html")
    return render(request, "index.html")