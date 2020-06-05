
from django.core.management import BaseCommand
from api.models import ProblemPrototype, ProblemHead, ProblemPoint, Profile, Prototype2Test, TestTemplate, TestItem, ProblemHeadItem, ProblemPointItem
from django.contrib.auth.models import User
import random

from api.logic import generate_test_template, generate_test_item

class Command(BaseCommand):

    def handle(self, *args, **options):
        users = [User.objects.get_or_create(id=i, username=f't_username_{i}', password='ja9dsf03DFAd')[0] for i in range(6)]
        profiles = [Profile.objects.get_or_create(user=user)[0] for user in users]
        for profile in profiles:
            profile.has_access = True
        prototypes = [ProblemPrototype.objects.create(
            name=f"prototype #{i}",
            description=f"some description in prototype #{i}"
            ) for i in range(6)]
        heads = [
            ProblemHead.objects.create(
                problem=f"problem text for problem #{i}"
            )
            for i in range(len(prototypes)*10)
        ]
        for head in heads:
            curr_prototypes = random.choices(prototypes, k=random.randrange(1, 3))
            head.prototype.add(*curr_prototypes)

        points = [
            ProblemPoint.objects.create(
                problem_head = head,
                answer = f"some answer for point {j} in problem {i}",
                num_in_problem = j
            )
            for j in range(random.randrange(1, 5)) for i, head in enumerate(heads)
        ]
        for i in range(4):
            generate_test_template(profiles[i], f"template #{i}", *random.choices(prototypes, k=3))

        templates = [TestTemplate.objects.get(id=i) for i in range(1, 5)]
        test_items = [
            generate_test_item(random.choice(templates), random.choice(profiles)) for i in range(20)
        ]
