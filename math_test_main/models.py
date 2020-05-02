from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Set(models.Model):
    name = models.CharField()

    class Meta:
        verbose_name = "Сет с задачами"
        verbose_name_plural = "Сеты с задачами"


class Task(models.Model):
    # условие задачи
    problem = models.TextField()
    answer = models.TextField()
    set = models.ManyToManyField(Set)

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"


class TestTemplate(models.Model):
    # ссылка на автора теста
    author = models.ForeignKey('Profile', on_delete=models.SET_NULL, null=True)
    name = models.CharField()

    class Meta:
        verbose_name = "Шаблон теста"
        verbose_name_plural = "Шаблоны тестов"


class Set2Test(models.Model):
    test_id = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)

    # если удалить сет с задачами, то шаблоны тоже удалятся?
    # мне кажется, это должно работать не так, поэтому PROTECT
    set_id = models.ForeignKey('Set', on_delete=models.PROTECT)
    index = models.PositiveSmallIntegerField()


class TestItem(models.Model):
    student_id = models.ForeignKey('Profile', on_delete=models.CASCADE)
    template_id = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Экземпляр теста"
        verbose_name_plural = "Экземпляры тестов"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # поле, показывающее есть ли у пользователя доступ к задачам из базы
    has_access = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"


class TaskItem(models.Model):
    test_id = models.ForeignKey('TestItem', on_delete=models.CASCADE)

    # пока просто текст
    answer = models.TextField()
    # балл за задачу
    score = models.SmallIntegerField()
    # комментарий к задаче
    comment = models.TextField()
    # номер задачи в тесте, нужен для правильного отображения ответов на тест.
    index = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Решение ученика"
        verbose_name_plural = "Решения учеников"
