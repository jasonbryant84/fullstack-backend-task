from rest_framework import serializers
from .models import Message, ChatSession, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "created_timestamp", "last_modified_timestamp")
        read_only_fields = ("id", "created_timestamp", "last_modified_timestamp")


class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ("id", "user", "created_timestamp", "last_modified_timestamp")
        read_only_fields = ("id", "created_timestamp", "last_modified_timestamp")


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id", "user", "username", "session", "content", "timestamp")
        read_only_fields = ("id", "timestamp")
