from django.contrib import admin
from django.urls import re_path, include, path

from MathTest import views
from ser.views import autofill

urlpatterns = [
    path('api/', include('api.urls')),
    path('api/admin/', admin.site.urls),
    path('api/autofill/', autofill),
    path('api/auth/', include('rest_auth.urls')),
    path('api/auth/registration/', include('rest_auth.registration.urls')),
    re_path(r'^', views.index),
]
