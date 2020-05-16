from django.urls import path

from api.views import ProblemPrototypes, problem_heads, users, test_templates, get_test

urlpatterns = [
    path('problem_prototypes', ProblemPrototypes.as_view()),
    path('problem_heads/<int:id>', problem_heads),
    path('problem_heads', problem_heads),
    path('users', users),
    path('templates', test_templates),
    path('get_test', get_test),
]
