from django.urls import path

from api.views import PointItem, ProblemPrototypes, problem_heads, users, test_templates, generate_template, get_test, \
    check_test_point, tests

urlpatterns = [
    path('problem_prototypes', ProblemPrototypes.as_view()),
    path('problem_heads/<int:id>', problem_heads),
    path('problem_heads', problem_heads),
    path('users', users),
    path('templates', test_templates),
    path('generate_template', generate_template),
    path('get_test', get_test),
    path('point_item', PointItem.as_view()),
    path('check_test_point', check_test_point),
    path('tests', tests),
]
