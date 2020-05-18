from api.views import problem_heads
from api.logic import generate_test_template
from django.test import TestCase
from .models import *
from .exceptions import NotAllowedException

class TestGenerateTestTemplate(TestCase):
    def setUp(self):
        u = User.objects.create(username="Test", password="dnsjiajfvj")
        p = Profile.objects.create(user=u, has_access=True)
        self.author = p
        prototypes = [ProblemPrototype.objects.create(name=f"{i}") for i in range(10)]
        self.prototypes = prototypes
    
    def testSmoke(self):
        generate_test_template(self.author, "test", *self.prototypes[:3])
        template = TestTemplate.objects.filter(author=self.author, name="test")
        self.assertEqual(len(template), 1)
        template = template[0]
        p2t = Prototype2Test.objects.filter(test=template)
        self.assertEqual(len(p2t), 3)

        for count, prototype in enumerate(self.prototypes[:3]):
            p2t = Prototype2Test.objects.filter(test=template, set=prototype, index=count)
            self.assertEqual(len(p2t), 1)
    
    def testError(self):
        self.author.has_access = False
        self.author.save()
        with self.assertRaises(NotAllowedException):
            generate_test_template(self.author, "test", *self.prototypes[:3])

