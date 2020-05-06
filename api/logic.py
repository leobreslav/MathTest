from .models import TestTemplate, Prototype2Test, TestItem
from .exceptions import NotAllowedException


def generate_test_template(author, name, *task_prototypes):
    if not author.has_access:
        raise NotAllowedException("Author can't create test_template")
    
    template = TestTemplate.objects.create(author=author, name=name)

    for count, prototype in enumerate(task_prototypes):
        Prototype2Test.objects.create(test=template, set=prototype, index=count)
