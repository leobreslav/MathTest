from django.shortcuts import render


def index(request):
    # return redirect('problem_prototypes/')  # temporary
    return render(request, "index.html")
