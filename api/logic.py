import random
import string
from datetime import datetime

from api.models import *
from api.exceptions import NotAllowedException


def generate_test_template(author, name, *task_prototypes):
    if not author.has_access:
        raise NotAllowedException("Author can't create test_template")
    
    template = TestTemplate.objects.create(author=author, name=name)

    for count, prototype in enumerate(task_prototypes):
        Prototype2Test.objects.create(test=template, set=prototype, index=count)


def generate_test_item(template, student):
    test_item = TestItem.objects.create(template=template, student=student)

    prototypes = Prototype2Test.objects.filter(test=template).order_by('index')

    for i, prototype in enumerate(prototypes):
        problem_heads = ProblemHead.objects.all(prototype=prototype)
        problem_head = random.choice(problem_heads)

        head_item = ProblemHeadItem.objects.create(test=test_item, problem_head=problem_head, index=i)

        points = ProblemPoint.objects.filter(problem_head=problem_head)
        for j in range(points):
            ProblemPointItem.objects.create(problem_item=head_item, num_in_problem=j)


