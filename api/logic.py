import random

from .models import *
from .exceptions import BadRequestException, NotAllowedException
from typing import Union, List


def generate_test_template(author, name, *task_prototypes):

    if len(task_prototypes) == 0:
        raise BadRequestException("Can't create template without prototypes")

    if not author.has_access:
        raise NotAllowedException("Author can't create test_template")
    
    template = TestTemplate.objects.create(author=author, name=name)

    for count, prototype in enumerate(task_prototypes):
        Prototype2Test.objects.create(test=template, set=prototype, index=count)


def generate_test_item(template, student):
    test_item = TestItem.objects.create(template=template, student=student)

    prototypes = Prototype2Test.objects.filter(test=template).order_by('index')

    for i, prototype in enumerate(prototypes):
        problem_heads = ProblemHead.objects.filter(prototype=prototype.set)

        if len(problem_heads) == 0:
            raise NotAllowedException('Cannot create a test from a template with empty prototypes')

        problem_head = random.choice(problem_heads)

        head_item = ProblemHeadItem.objects.create(test=test_item, problem_head=problem_head, index=i)

        points = ProblemPoint.objects.filter(problem_head=problem_head)
        for point in points:
            ProblemPointItem.objects.create(problem_item=head_item, num_in_problem=point.num_in_problem)
    return test_item

def rename_file_on_upload(instance, filename):
    letters = string.ascii_lowercase
    random_name = ''.join(random.choice(letters) for i in range(10))
    new_filename = "media/UserSolutionFile/"+datetime.today().strftime('%Y/%m/%d/') + random_name
    ext = filename.split('.')[-1]
    return '{}.{}'.format(new_filename, ext)

def get_data(request, dict_name:str, args:dict):
    data = getattr(request, dict_name, None)
    ret = []
    if data is None:
        raise BadRequestException("Wrong request type")
    for name, mapping in args.items():
        arg = data.get(name, None)
        if arg is None:
            raise BadRequestException(f"Request do not have {name} in {dict_name}")
        ret.append(mapping(arg))
    return tuple(ret)


def get_model(model:models.Model, ids:Union[int, List[int]], many:bool=False):
    if not many:
        mod = model.objects.filter(id=ids)
        if len(mod) == 0:
            raise BadRequestException(f"Wrong id of model")
        return mod[0]
    ret = []
    for id in ids:
        mod = model.objects.filter(id=id)
        if len(mod) == 0:
            raise BadRequestException(f"Wrong id of model")
        ret.append(mod[0])
    return ret
