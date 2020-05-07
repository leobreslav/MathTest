from django.db import migrations

from api import db


def clearnfill(apps, schema_editor):
    db.autoclear()
    db.autofill()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200506_1517'),
    ]

    operations = [
        migrations.RunPython(clearnfill),
    ]
