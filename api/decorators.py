from rest_framework.response import Response
from typing import Callable, Union, Any
from django.db.models import Model
from functools import partial

Arg = Union[int, str] 

def __arg_processor(arg: Arg):
    def decorator(f):
        def wrapper(*args, **kwargs):
            def caller(fun, c_arg, delete=False, *c_args, **c_kwargs):
                if isinstance(arg, str):
                    kwargs.pop(arg)
                    fun = partial(fun, *args, *c_args,**c_kwargs, **kwargs)
                    if not delete:
                        fun = partial(fun,  **{arg: c_arg})
                    return fun()
                fun = partial(fun, *args[:arg])
                if not delete:
                    fun = partial(fun, c_arg)
                fun = partial(fun, *args[arg+1:], *c_args, **kwargs, **c_kwargs)
                return fun()
            if isinstance(arg, int):   
                return f(caller, args[arg])
            return f(caller, kwargs[arg])
        return wrapper
    return decorator


def get_model(
    model:Model,
    arg: Arg, 
    many:bool=False, 
    fun:str="get",
    field:str="id", 
    call_if:bool=True,
    new_name:str=None
    ):
    def decorator(f):
        if not call_if:
            return f
        
        @__arg_processor(arg)
        def wrapper(call, arg):
            if not many:
                m = getattr(model.objects, fun)(**{field:arg})
                if new_name:
                    return call(f, None, delete=True, **{new_name: m})
                return call(f, m)
            ret = []
            for i in arg:
                ret.append(getattr(model.objects, fun)(**{field:i}))
            
            if new_name:
                return call(f, None, delete=True, **{new_name: ret})
            return call(f, ret)   
        return wrapper
    return decorator


def check(arg:Arg, fun: Callable[[Any], bool], if_false=Response(status=400)):
    def decorator(f):
        @__arg_processor(arg)
        def wrapper(call, obj):
            if not fun(obj):
                return if_false
            return call(f, obj)
        return wrapper
    return decorator

def name_arg(arg:Arg, name:str):
    def decorator(f):
        @__arg_processor(arg)
        def wrapper(call, obj):
            return call(f, None, True, **{name: obj})
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
            getter = getattr(data, "get", None)
            if getter:
                getter = data
            if not getter:
                getter = getattr(data, "__dict__", None)
            if getter is None:
                return Response(status=400)
            for arg, mapping in params.items():
                curr = getter.get(arg, None)
                if not curr:
                    return Response(status=400)
                wrap_args[arg] = mapping(curr)
            return call(f, request, **wrap_args)
        return wrapper
    return decorator