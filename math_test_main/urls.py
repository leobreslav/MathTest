from django.urls import path

from math_test_main import views

urlpatterns = [
    path('problem_prototypes', views.problem_prototypes)
]
