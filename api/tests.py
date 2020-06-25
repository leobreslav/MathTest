from io import StringIO
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient, APITestCase

from api.logic import generate_test_template
from .exceptions import BadRequestException
from .exceptions import NotAllowedException
from .logic import get_data, get_model
from .models import *


class TestGetData(TestCase):
    class FakeRequest:
        pass

    def setUp(self):
        
        self.request = self.FakeRequest()
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

    def testNone(self):
        self.assertEqual(
            get_data(
                self.request,
                "data",
                {
                    "int": None,
                    "float": float,
                    "arr_int": None
                }
            ),
            ("1", 1.0034, ["1", "2", "3"])
        )


class TestGetModel(TestCase):
    def setUp(self):
        self.model = ProblemPrototype
        self.testing_model = self.model.objects.create(name="test")
        self.testing_models = [self.model.objects.create(name=f"{i}") for i in range(5)]
        self.ids = list(map(lambda x: x.id, self.testing_models))
        self.id = self.testing_model.id
    
    def testSmoke(self):
        model = get_model(self.model, self.id)
        self.assertEqual(model, self.testing_model)
    
    def testMany(self):
        models = get_model(self.model, self.ids, many=True)
        self.assertEqual(len(models), len(self.testing_models))
        for model in models:
            self.assertIn(model, self.testing_models)

    def testBadData(self):
        with self.assertRaises(BadRequestException):
            get_model(self.model, 15000000)
        
    def testManyBadData(self):
        with self.assertRaises(BadRequestException):
            get_model(self.model, [15000000, 150000001], many=True)


class TestGenerateTemplateView(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='test', password='test')
        self.profile = self.user.profile
        self.profile.has_access = True
        self.profile.save()
        self.prototypes = [ProblemPrototype.objects.create(name=f"{i}") for i in range(10)]
        self.prototype_ids = list(map(lambda x: x.id, self.prototypes))
    
    def testSmoke(self):
        client = APIClient()
        client.force_authenticate(self.user)
        post_data = {
            "name": "test",
            "prototype_ids": self.prototype_ids[:3]
        }
        r = client.post("/api/generate_template", data=post_data)
        self.assertEqual(r.status_code, 201)
        

class TestGenerateTestTemplate(TestCase):
    def setUp(self):
        u = User.objects.create(username="Test", password="dnsjiajfvj")
        p = u.profile
        p.has_access = True
        p.save()
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
    
    def testAccess(self):
        self.author.has_access = False
        self.author.save()
        with self.assertRaises(NotAllowedException):
            generate_test_template(self.author, "test", *self.prototypes[:3])
    
    def testWithoutPrototypes(self):
        with self.assertRaises(BadRequestException):
            generate_test_template(self.author, "test", *[])


class TestGetTest(APITestCase):
    def setUp(self):
        user = User.objects.create(username='test', password='test')

        profile = user.profile
        profile.has_access = True
        profile.save()
        prototype = ProblemPrototype.objects.create(name='test_prototype')
        problem_head = ProblemHead.objects.create(problem='test problem definition')
        problem_head.prototype.add(prototype)
        template = TestTemplate.objects.create(author=profile, name='test_template')
        Prototype2Test.objects.create(test=template, set=prototype, index=0)
        

    def test_smoke(self):
        user = User.objects.get(username='test')
        c = APIClient()
        c.force_authenticate(user=user)

        request = c.get('/api/generate_test?template_id=1')
        self.assertEquals(request.status_code, 200)

        id = request.data['item_id']
        self.assertEqual(TestItem.objects.get(id=id).problem_items.all()[0].problem_head.problem, 'test problem definition')


class AutofillTest(APITestCase):
    def test_smoke(self):
        out = StringIO()
        call_command('autofill', stdout=out)
        self.assertEqual('', out.getvalue())

        c = APIClient()
        self.assertEqual(c.login(username='t_username_5', password='ja9dsf03DFAd'), True)
