from .models import TestTemplate, Prototype2Test

def generate_test_template(author, name, *task_prototypes):
    if not author.has_access:
        raise Exception("Author can't create test_template")
    
    template = TestTemplate.objects.create(author=author, name=name)

    for count, prototype in enumerate(task_prototypes):
        Prototype2Test.objects.create(test_id=template, set_id=prototype, index=count)
    


