import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DB_CONFIG = {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": os.path.join(BASE_DIR, 'db.sqlite3')
}

DEBUG = True

SECRET_KEY = "YourSecretKey"

ALLOWED_HOSTS = ['0.0.0.0', 'localhost', 'mathtest-40579.herokuapp.com']

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')