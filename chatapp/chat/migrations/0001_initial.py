# Generated by Django 4.2.4 on 2023-09-02 20:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ChatSession",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_timestamp", models.DateTimeField(auto_now_add=True)),
                ("last_modified_timestamp", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "chat_session",
                "ordering": ("created_timestamp",),
            },
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(blank=True, max_length=255, null=True)),
                ("created_timestamp", models.DateTimeField(auto_now_add=True)),
                ("last_modified_timestamp", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "chat_user",
                "ordering": ("created_timestamp",),
            },
        ),
        migrations.CreateModel(
            name="Message",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(blank=True, max_length=255, null=True)),
                ("content", models.TextField()),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "session",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="chat.chatsession",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="chat.user",
                    ),
                ),
            ],
            options={
                "db_table": "chat_message",
                "ordering": ("timestamp",),
            },
        ),
        migrations.AddField(
            model_name="chatsession",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="chat.user",
            ),
        ),
    ]