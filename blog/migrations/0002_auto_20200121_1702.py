# Generated by Django 3.0.2 on 2020-01-21 17:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='meail',
            new_name='mail',
        ),
    ]
