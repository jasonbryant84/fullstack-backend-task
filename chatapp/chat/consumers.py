import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatSession, Message, User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Connecting the websocket"""

        self.room_name = (
            self.scope["url_route"]["kwargs"]["room_name"]
            if "url_route" in self.scope
            else "session_test"
        )

        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, _):
        """Disonnecting the disconnect the websocket"""

        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    @database_sync_to_async
    def get_create_user(self, username):
        """Get or Create the user with username"""

        return User.objects.get_or_create(name=username)

    @database_sync_to_async
    def get_session(self, session_id):
        """Get session by id"""

        return ChatSession.objects.get(pk=session_id)

    @database_sync_to_async
    def create_message(self, message, user, session):
        """Create a message instance in the db"""

        message_obj = Message.objects.create(
            content=message, user=user, username=user.name or "here", session=session
        )
        return message_obj

    # Receive message from WebSocket
    async def receive(self, text_data):
        """Receive method for websocket"""

        text_data_json = json.loads(text_data)
        content = text_data_json.get("content", None)
        username = text_data_json.get("username", None)
        session_id = text_data_json.get("session_id", None)

        # Find the existing user or create a new one if needed
        user, user_created = await self.get_create_user(
            username
        )

        if not user_created and not user:
            print("Handle Error condition where no user was created or found in the db")
            return

        # Find the existing session or create a new on if needed
        session = await self.get_session(
            session_id
        )
        if not session:
            print(
                "Handle Error condition where no session was created or found in the db"
            )
            return

        # Create a new message object and save it to the database
        if content:
            user_messsage = await self.create_message(content, user, session)
        else:
            print("Handle Error condition where no message was created in the db")
            return

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "username": user.name,
                "message": content,
                "session_id": session.id,
                "timestamp": str(user_messsage.timestamp),
                "isChatbot": False,
            },
        )

        # Echo user's message as the chatbot user and save it to the db
        chatbot, _ = await self.get_create_user("chatbot")

        chatbot_message = await self.create_message(content, chatbot, session)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "username": "chatbot",
                "message": content,
                "session_id": session.id,
                "timestamp": str(
                    chatbot_message.timestamp
                ),  # Parotting the user's (input) text
                "isChatbot": True,
            },
        )

    # Receive message from room group
    async def chat_message(self, event):
        """
        Sending received message from the room group
        over the websocket
        """

        content = event["message"]
        is_chatbot = event["isChatbot"]
        session_id = event.get("session_id", "no id")
        username = event.get("username", None)
        timestamp = event.get("timestamp", None)

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "content": content,
                    "session_id": session_id,
                    "username": username,
                    "timestamp": timestamp,
                    "isChatbot": is_chatbot,
                }
            )
        )
