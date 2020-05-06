from random import random

from .models import *
from .exceptions import NotAllowedException


def generate_test_template(author, name, *task_prototypes):
    if not author.has_access:
        raise NotAllowedException("Author can't create test_template")
    
    template = TestTemplate.objects.create(author=author, name=name)

    for count, prototype in enumerate(task_prototypes):
        Prototype2Test.objects.create(test=template, set=prototype, index=count)


def generate_test_item(template, student):
    TestItem.objects.create(template=template, student=student)

    prototypes = Prototype2Test.objects.filter(test=template).order_by('index')

    for prototype in prototypes:
        problem_heads = ProblemHead.objects.all(prototype=prototype)
        problem_head = problem_heads[random.range(0, len(problem_heads), 1)]

