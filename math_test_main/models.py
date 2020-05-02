from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Set(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Сет с задачами"
        verbose_name_plural = "Сеты с задачами"

    def __str__(self):
        return self.name


class Task(models.Model):
    # условие задачи
    problem = models.TextField()
    answer = models.TextField()
    set = models.ManyToManyField(Set)

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"

    def __str__(self):
        return self.problem[:50]


class TestTemplate(models.Model):
    # ссылка на автора теста
    author = models.ForeignKey('Profile', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Шаблон теста"
        verbose_name_plural = "Шаблоны тестов"

    def __str__(self):
        return self.name


class Set2Test(models.Model):
    test_id = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)

    # если удалить сет с задачами, то шаблоны тоже удалятся?
    # мне кажется, это должно работать не так, поэтому PROTECT
    set_id = models.ForeignKey('Set', on_delete=models.PROTECT)
    index = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "тип задач в тесте"
        verbose_name_plural = "типы задач в тестах"

    def __str__(self):
        return f'{self.index} задача в {self.test_id}'


class TestItem(models.Model):
    student_id = models.ForeignKey('Profile', on_delete=models.CASCADE)
    template_id = models.ForeignKey('TestTemplate', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Экземпляр теста"
        verbose_name_plural = "Экземпляры тестов"

    def __str__(self):
        return f'тест {self.template_id} для ученика {self.student_id.user.id}'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # поле, показывающее есть ли у пользователя доступ к задачам из базы
    has_access = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

    def __str__(self):
        return f'профиль пользователя {self.user.username}'


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

    def __str__(self):
        return f'решение {self.index} задачи из теста {self.test_id.template_id.name}'
