from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from api.models import Profile, TestTemplate, ProblemPrototype, Prototype2Test, ProblemHead


# Create your tests here.


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
        print('/api/get_test?template_id=1: ' +
              str(c.get('/api/get_test?template_id=1').data))

        self.assertEquals(request.data[0]['problem_head']['problem'], 'test problem definition')
