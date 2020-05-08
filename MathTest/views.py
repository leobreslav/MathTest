from django.shortcuts import render, redirect


def problem_prototypes(request):
    return render(request, "problem_prototypes.html")


def index(request):
    return redirect('problem_prototypes/')  # temporary
