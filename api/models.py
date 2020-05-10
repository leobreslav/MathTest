from django.db import models
from django.contrib.auth.models import User


# Create your models here.
from api.logic import rename_file_on_upload


class ProblemPrototype(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='No description yet')

    class Meta:
        verbose_name = "Problem prototype"
        verbose_name_plural = "Problem prototypes"

    def __str__(self):
        return self.name

    @property
    def example(self):
        return self.problemhead_set.first()

class ProblemHead(models.Model):
    problem = models.TextField()
    prototype = models.ManyToManyField(ProblemPrototype)

    class Meta:
        verbose_name = "Problem"
        verbose_name_plural = "Problems"

    def __str__(self):
        return self.problem[:50]


class ProblemPoint(models.Model):
    problem_head = models.ForeignKey('ProblemHead', on_delete=models.CASCADE)
    answer = models.TextField()
    num_in_problem = models.IntegerField()

    class Meta:
        verbose_name = "Problem Point"
        verbose_name_plural = "Problem points"

    def __str__(self):
        return f"Point {self.num_in_problem} of {self.problem_head}"


class TestTemplate(models.Model):
    # link to the author of test
    author = models.ForeignKey('Profile', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Test template"
        verbose_name_plural = "Test templates"

    def __str__(self):
        return self.name


# match between sets and templates
class Prototype2Test(models.Model):
    test = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)
    set = models.ForeignKey('ProblemPrototype', on_delete=models.PROTECT)
    index = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "problem type in test"
        verbose_name_plural = "problem types in tests"

    def __str__(self):
        return f'{self.index} problem in {self.test}'


# instance of test
class TestItem(models.Model):
    student = models.ForeignKey('Profile', on_delete=models.CASCADE)
    template = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Test instance"
        verbose_name_plural = "Test instances"

    def __str__(self):
        return f'test {self.template} for student {self.student.user.id}'


# extending of default django user
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # field, showing whether the user has access to problem from db
    has_access = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return f"{self.user.username}'s profile"


# instance of Problem particular student
class ProblemHeadItem(models.Model):
    test = models.ForeignKey('TestItem', on_delete=models.CASCADE)

    # instance of problem must reference to the problem
    # otherwise we won't be able to access to the problem, and, for example, get answer on it
    problem_head = models.ForeignKey('ProblemHead', on_delete=models.CASCADE)

    # required for correct displaying test results
    index = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Problem head item"
        verbose_name_plural = "Problem head items"

    def __str__(self):
        return f'instance of {self.index} from {self.test.template.name}'


# instance of Problem Item
class ProblemPointItem(models.Model):
    problem_item = models.ForeignKey('ProblemHeadItem', on_delete=models.CASCADE)
    answer = models.TextField()
    score = models.PositiveSmallIntegerField()
    comment = models.TextField()
    num_in_problem = models.IntegerField()

    class Meta:
        verbose_name = "answer on problem's point"
        verbose_name_plural = "answers on problem's points"

    def __str__(self):
        return f"answer on {self.num_in_problem} of {self.problem_item}"


class UserSolutionFile(models.Model):
    file = models.FileField(upload_to=rename_file_on_upload)
    task = models.ForeignKey(ProblemPointItem, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "user's solution file"
        verbose_name_plural = "user's solution files"

    def __str__(self):
        return f"solution file #{self.id}"
