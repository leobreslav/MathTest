from django.core.management import BaseCommand
from api.models import ProblemPrototype, ProblemHead, ProblemPoint, Profile, Prototype2Test, TestTemplate, TestItem, \
    ProblemHeadItem, ProblemPointItem
from django.contrib.auth.models import User
import random

from api.logic import generate_test_template, generate_test_item


class Command(BaseCommand):

    def handle(self, *args, **options):
        users = []
        for i in range(6):
            user = User.objects.get_or_create(username=f't_username_{i}')[0]
            user.set_password('ja9dsf03DFAd')
            user.save()
            users.append(user)

        profiles = [Profile.objects.get(user=user) for user in users]
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
            for i in range(len(prototypes) * 10)
        ]
        for head in heads:
            curr_prototypes = random.choices(prototypes, k=random.randrange(1, 3))
            head.prototype.add(*curr_prototypes)

        for i, head in enumerate(heads):
            for j in range(random.randrange(1, 5)):
                ProblemPoint.objects.create(
                    problem_head=head,
                    answer=f"some answer for point {j} in problem {i}",
                    num_in_problem=j
                )
        for i in range(4):
            generate_test_template(profiles[i], f"template #{i}", *random.choices(prototypes, k=3))

        templates = [TestTemplate.objects.get(id=i) for i in range(1, 5)]
        for i in range(20):
            generate_test_item(random.choice(templates), random.choice(profiles))
