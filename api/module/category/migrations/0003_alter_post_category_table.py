# Generated by Django 4.1.7 on 2023-02-16 08:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0002_alter_category_options_alter_post_category_options_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='post_category',
            table='posts_categories',
        ),
    ]
