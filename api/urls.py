from django.urls import path

from api.views import ProblemPrototypes, problem_heads, users, create_template, problem_head_by_prototype, test_templates

urlpatterns = [
    path('problem_prototypes', ProblemPrototypes.as_view()),
    path('problem_heads/<int:id>', problem_head_by_prototype),
    path('problem_heads', problem_heads),
    path('users', users),
    path('create_test_template', create_template),
    path('templates', test_templates)
]
