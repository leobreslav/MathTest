import json

from django.core.management import BaseCommand

from api.models import ProblemPrototype, ProblemHead, ProblemPoint


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('file_path', nargs='?')

    def handle(self, *args, **options):
        with open(options['file_path']) as f:
            prototypes = json.load(f)

            names = []
            for i, prototype in enumerate(prototypes):
                if 'name' not in prototype or 'description' not in prototype or \
                        'problem_heads' not in prototype:
                    self.stderr.write('import failed')
                    self.stderr.write('error in prototype #' + str(i + 1) + ": some required fields are not present")
                    return

                if prototype['name'] in names:
                    self.stderr.write('import failed')
                    self.stderr.write('error in prototypes #' + str(names.index(prototype['name']) + 1) + ' and #' +
                                      str(i + 1) + ': names are equal')
                    return

                if len(ProblemPrototype.objects.filter(name=prototype['name'])) > 0:
                    self.stdout.write('WARNING: prototype #' + str(i + 1) + ' is already present in the db, skipping')

                for k, head in enumerate(prototype['problem_heads']):
                    if 'problem' not in head or 'problem_points_answers' not in head:
                        self.stderr.write('import failed')
                        self.stderr.write('error in prototype #' + str(i + 1) + " in problem #" + str(k + 1) +
                                          ": some required fields are not present")
                        return

                names.append(prototype['name'])

            names = []
            self.stdout.write('test', ending='')
            for i, prototype in enumerate(prototypes):
                if len(ProblemPrototype.objects.filter(name=prototype['name'])) > 0:
                    continue

                names.append(prototype['name'])
                p = ProblemPrototype.objects.create(name=prototype['name'], description=prototype['description'])

                for j, head in enumerate(prototype['problem_heads']):
                    self.stdout.write('\rimporting ' + prototype['name'] + ' #' + str(j + 1) + ' of ' +
                                      str(len(prototype['problem_heads'])), ending='                                 ')
                    h = ProblemHead.objects.create(problem=head['problem'])
                    h.prototype.add(p)

                    for k, point in enumerate(head['problem_points_answers']):
                        ProblemPoint.objects.create(problem_head=h, answer=point, num_in_problem=k)

            if len(names) == 0:
                self.stdout.write('nothing to import: empty file or all prototypes are already in db')
            else:
                self.stdout.write('\rsuccessfully imported ' + str(len(prototypes)) + ' prototypes: ' + str(names))
