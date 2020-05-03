"""
WSGI config for MathTest project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
try:
	from whitenoise.django import DjangoWhiteNoise# for Heroku
except:
	pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MathTest.settings')

application = get_wsgi_application()
try:
	application = DjangoWhiteNoise(application)# for Heroku
except:
	pass
