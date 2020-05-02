from django.db import models


# Create your models here.

class Set(models.Model):
    name = models.CharField()


class Task(models.Model):
    problem = models.TextField()
    answer = models.TextField()
    set = models.ManyToManyField(Set)


class TestTemplate(models.Model):
    author = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    name = models.CharField()


class Set2Test(models.Model):
    test_id = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)

    # если удалить сет с задачами, то шаблоны тоже удалятся?
    # мне кажется, это должно работать не так, поэтому PROTECT
    set_id = models.ForeignKey('Set', on_delete=models.PROTECT)
    index = models.PositiveSmallIntegerField()


class TestItem(models.Model):
    student_id = models.ForeignKey('User', on_delete=models.CASCADE)
    template_id = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)


class User(models.Model):
    first_name = models.CharField()
    last_name = models.CharField()
    email = models.EmailField()

    # поле, показывающее есть ли у пользователя доступ к задачам из бвзы
    has_access = models.BooleanField()


class TaskItem(models.Model):
    test_id = models.ForeignKey('TestItem', on_delete=models.CASCADE)

    # пока просто текст
    answer = models.TextField()
    score = models.SmallIntegerField()
    comment = models.TextField()
    index = models.PositiveSmallIntegerField()
