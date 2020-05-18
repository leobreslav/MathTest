from django.urls import path

from api.views import ProblemPrototypes, problem_heads, users, test_templates, generate_template

urlpatterns = [
    path('problem_prototypes', ProblemPrototypes.as_view()),
    path('problem_heads/<int:id>', problem_heads),
    path('problem_heads', problem_heads),
    path('users', users),
    path('templates', test_templates),
    path('generate_template', generate_template)
]
