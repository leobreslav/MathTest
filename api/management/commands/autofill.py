
from django.core.management import BaseCommand
from api.models import ProblemPrototype, ProblemHead, ProblemPoint, Profile, Prototype2Test, TestTemplate, TestItem, ProblemHeadItem, ProblemPointItem
from django.contrib.auth.models import User
import random

class Command(BaseCommand):
    def handle(self, *args, **options):
        # User & Profile
        for i in range(1,6):
            UserNew = User.objects.create_user('t_username_'+str(i), 't_username_'+str(i)+'@thebeatles.com', 'ja9dsf03DFAd')
            ProfileNew = Profile.objects.create(user = UserNew, has_access = True)
            # TestTemplate
            for j in range(1,3):
                TestTemplateNew = TestTemplate.objects.create(author = ProfileNew, name = 'Шаблон теста № ' + str(j))
            # TestTemplate

        # ProblemPrototype
        for i in range(1,6):
            ProblemPrototypeNew = ProblemPrototype.objects.create(name = 'Прототип задачи № ' + str(i))
            # ProblemHead
            for j in range(1,4):
                ProblemHeadNew = ProblemHead.objects.create(problem = 'Пример текста головы задачи № ' + str(j))
                ProblemHeadNew.prototype.add(ProblemPrototypeNew)
                #ProblemHeadNew.prototype.add(random.choice(ProblemPrototype.objects.all()))
                ProblemHeadNew.save()
                # ProblemPoint
                for k in range(1,3):
                    ProblemPointNew = ProblemPoint.objects.create(problem_head = ProblemHeadNew,
                    answer = 'Ответ к задаче № ' + str(j) + ", пункту № " + str(k), num_in_problem = k)
        # Prototype2Test
        for each in TestTemplate.objects.all():
            for i in range(1,4):
                Prototype2TestNew = Prototype2Test.objects.create(test = each, set = random.choice(ProblemPrototype.objects.all()), index = i)
        # students & TestItem
        for i in range(1,11):
            UserNew = User.objects.create_user('s_username_'+str(i), 's_username_'+str(i)+'@thebeatles.com', 'ja9dsf03DFAd')
            ProfileNew = Profile.objects.create(user = UserNew, has_access = False)
            for j in range(1,2):
                TestItemNew = TestItem.objects.create(student = ProfileNew,
                                template = random.choice(TestTemplate.objects.all()))
                for t2t in Prototype2Test.objects.filter(test=TestItemNew.template):
                    done = False
                    try:
                        ProblemHeadItemNew = ProblemHeadItem.objects.create(test = TestItemNew,
                            problem_head = random.choice(ProblemHead.objects.filter(prototype = t2t.set)),
                            index = t2t.index)
                        done = True
                    except:
                        done = True
                    if done:
                        for pp in ProblemPoint.objects.filter(problem_head = ProblemHeadItemNew.problem_head):
                            ProblemPointItemNew = ProblemPointItem.objects.create(problem_item = ProblemHeadItemNew, answer = 'Некоторый ответ',
                            score = random.choice(range(1,4)), comment = 'Некоторый комментарий', num_in_problem = pp.num_in_problem)
