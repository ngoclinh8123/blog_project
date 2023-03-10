# Generated by Django 4.1.7 on 2023-02-17 04:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('post', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255, unique=True)),
                ('posts', models.ManyToManyField(blank=True, to='post.post')),
            ],
            options={
                'db_table': 'tags',
                'ordering': ['-id'],
            },
        ),
    ]
