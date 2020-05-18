from django.contrib import admin
from django.urls import re_path, include, path

from MathTest import settings
from MathTest import views
from django.conf.urls.static import static

urlpatterns = [
    path('api/', include('api.urls')),
    path('api/admin/', admin.site.urls),
    path('api/auth/', include('rest_auth.urls')),
    path('api/auth/registration/', include('rest_auth.registration.urls')),
    re_path(r'^', views.index),
]
if not settings.HAS_NGINX:
    urlpatterns = [ 
        *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
        *urlpatterns
    ]
