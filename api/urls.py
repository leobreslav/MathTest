from django.urls import path

from api import views
from api.views import ProblemPrototypes

urlpatterns = [
    path('problem_prototypes', ProblemPrototypes.as_view()),
]
