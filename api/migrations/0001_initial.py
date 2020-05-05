# Generated by Django 3.0.5 on 2020-05-04 17:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ProblemHead',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('problem', models.TextField()),
            ],
            options={
                'verbose_name': 'Problem',
                'verbose_name_plural': 'Problems',
            },
        ),
        migrations.CreateModel(
            name='ProblemHeadItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.PositiveSmallIntegerField()),
                ('problem_head_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ProblemHead')),
            ],
            options={
                'verbose_name': '',
                'verbose_name_plural': '',
            },
        ),
        migrations.CreateModel(
            name='ProblemPrototype',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Problem prototype',
                'verbose_name_plural': 'Problem prototypes',
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('has_access', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Profile',
                'verbose_name_plural': 'Profiles',
            },
        ),
        migrations.CreateModel(
            name='TestTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Profile')),
            ],
            options={
                'verbose_name': 'Test template',
                'verbose_name_plural': 'Test templates',
            },
        ),
        migrations.CreateModel(
            name='TestItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Profile')),
                ('template_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.TestTemplate')),
            ],
            options={
                'verbose_name': 'Test instance',
                'verbose_name_plural': 'Test instances',
            },
        ),
        migrations.CreateModel(
            name='Prototype2Test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.PositiveSmallIntegerField()),
                ('set_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.ProblemPrototype')),
                ('test_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.TestTemplate')),
            ],
            options={
                'verbose_name': 'problem type in test',
                'verbose_name_plural': 'problem types in tests',
            },
        ),
        migrations.CreateModel(
            name='ProblemPointItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.TextField()),
                ('score', models.PositiveSmallIntegerField()),
                ('comment', models.TextField()),
                ('num_in_problem', models.IntegerField()),
                ('problem_item_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ProblemHeadItem')),
            ],
            options={
                'verbose_name': "answer on problem's point",
                'verbose_name_plural': "answers on problem's point",
            },
        ),
        migrations.CreateModel(
            name='ProblemPoint',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.TextField()),
                ('num_in_problem', models.IntegerField()),
                ('problem_head', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ProblemHead')),
            ],
            options={
                'verbose_name': 'Problem Point',
                'verbose_name_plural': 'Problem points',
            },
        ),
        migrations.AddField(
            model_name='problemheaditem',
            name='test_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.TestItem'),
        ),
        migrations.AddField(
            model_name='problemhead',
            name='prototype',
            field=models.ManyToManyField(to='api.ProblemPrototype'),
        ),
    ]