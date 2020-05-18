# Generated by Django 3.0.5 on 2020-05-18 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20200510_1404'),
    ]

    operations = [
        migrations.AddField(
            model_name='problempointitem',
            name='is_answered',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='problempointitem',
            name='score',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
