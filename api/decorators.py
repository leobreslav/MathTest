from rest_framework.response import Response
from typing import Union
from django.db.models import Model

Arg = Union[int, str] 

def __arg_processor(arg: Arg):
    def decorator(f):
        def wrapper(*args, **kwargs):
            def caller(fun, c_arg, *c_args, **c_kwargs):
                if isinstance(arg, str):
                    kwargs.pop(arg)
                    return fun(*args, *c_args, **{arg: c_arg},**c_kwargs, **kwargs)
                return fun(*args[:arg], c_arg, *args[arg+1:], *c_args, **kwargs, **c_kwargs)
            if isinstance(arg, int):   
                return f(caller, args[arg])
            return f(caller, kwargs[arg])
        return wrapper
    return decorator


def get_model(model:Model, arg: Arg, many:bool=False, fun:str="get", field:str="id", call_if:bool=True):
    def decorator(f):
        if not call_if:
            return f
        @__arg_processor(arg)
        def wrapper(call, arg):
            if not many:
                m = getattr(model.objects, fun)(**{field:arg})
                return call(f, m)
            ret = []
            for i in arg:
                ret.append(getattr(model.objects, fun)(**{field:i}))
            return call(f, ret)
        return wrapper
    return decorator


def requires_params(field:str, params:dict, request_pos:Arg=0):
    def decorator(f):
        @__arg_processor(request_pos)
        def wrapper(call, request):
            data = getattr(request, field, None)
            if not data:
                return Response(status=400)
            wrap_args = {}
            for arg, mapping in params.items():
                curr = data.get(arg, None)
                if not curr:
                    return Response(status=400)
                wrap_args[arg] = mapping(curr)
            return call(f, request, **wrap_args)
        return wrapper
    return decorator