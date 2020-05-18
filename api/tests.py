from api.views import problem_heads
from api.logic import generate_test_template
from django.test import TestCase
from .logic import get_data
from unittest.mock import Mock, patch
from functools import partial
from .exceptions import BadRequestException

# Create your tests here.
class TestGetData(TestCase):
    class FackeRequest:
        pass

    def setUp(self):
        
        self.request = self.FackeRequest()
        self.request.data = {
            "int": "1",
            "float": "1.0034",
            "string": "akfvak",
            "arr_int": ["1", "2", "3"]
        }

    
    def testSmoke(self):
        self.assertEqual(
            get_data(
                self.request,
                "data",
                {
                    "int": int,
                    "float": float,
                    "arr_int": lambda x: list(map(int,x))
                }
            ),
            (1, 1.0034, [1, 2, 3])
        )

    def testNotData(self):
        with self.assertRaises(BadRequestException):
            get_data(self.request, "not_data", {})
    
    def testBadData(self):
        with self.assertRaises(BadRequestException):
            get_data(self.request, "data", {"arg": str})

class TestGenerateTemplate(TestCase):
    def setUp(self):
        pass
        
from .models import *
from .exceptions import NotAllowedException

from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase

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


class TestGetTest(APITestCase):
    def setUp(self):
        user = User.objects.create(username='test', password='test')

        profile = Profile.objects.create(user=user, has_access=True)
        prototype = ProblemPrototype.objects.create(name='test_prototype')
        problem_head = ProblemHead.objects.create(problem='test problem definition')
        problem_head.prototype.add(prototype)
        template = TestTemplate.objects.create(author=profile, name='test_template')
        Prototype2Test.objects.create(test=template, set=prototype, index=0)

    def test_smoke(self):
        user = User.objects.get(username='test')
        c = APIClient()
        c.force_authenticate(user=user)

        request = c.get('/api/get_test?template_id=1')
        self.assertEquals(request.status_code, 200)

        self.assertEquals(request.data[0]['problem_head']['problem'], 'test problem definition')

