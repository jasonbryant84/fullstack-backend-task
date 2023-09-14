from django.db import models


class User(models.Model):
    """Users will either be a chatbot or the client-side user"""

    name = models.CharField(max_length=255, null=False, unique=True)
    created_timestamp = models.DateTimeField(auto_now_add=True)
    last_modified_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.id} {self.name} created at: {self.created_timestamp} \
            last modified: {self.last_modified_timestamp}"

    class Meta:
        db_table = "chat_user"
        ordering = ("created_timestamp",)


class ChatSession(models.Model):
    """Chat Sessions have 1 user who created the session"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    created_timestamp = models.DateTimeField(auto_now_add=True)
    last_modified_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatSession: {self.id} {self.created_timestamp} {self.last_modified_timestamp}"

    class Meta:
        db_table = "chat_session"
        ordering = ("created_timestamp",)


class Message(models.Model):
    """
    Messages have 1 user who created the message
    and 1 session in which the message appears
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(
        ChatSession, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return f"Message: {self.id} '{self.content}' from {self.username} at {self.timestamp}"

    class Meta:
        db_table = "chat_message"
        ordering = ("timestamp",)
