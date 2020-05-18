from rest_framework.response import Response
from .exceptions import NotAllowedException, BadRequestException

def catch_errors(f):
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except NotAllowedException as e:
            return Response(e.args, status=403)
        except BadRequestException as e:
            return Response(e.args, status=400)
    return wrapper
        

