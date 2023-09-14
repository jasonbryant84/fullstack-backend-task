from channels.testing import WebsocketCommunicator
from django.test import TestCase
from chat.consumers import ChatConsumer
from chat.models import ChatSession, User


class WebSocketTests(TestCase):
    def setUp(self):
        self.consumer = ChatConsumer()
        self.ws_path = "ws/chat/session_test/"
        self.user = User.objects.create(name="Test User")
        self.session = ChatSession.objects.create(user=self.user)

    async def test_connect(self):
        # Create a WebSocket communicator for testing
        communicator = WebsocketCommunicator(self.consumer, self.ws_path)

        # Connect to the WebSocket
        connected, _ = await communicator.connect()

        self.assertTrue(connected, "WebSocket connection failed")

        # Disconnect
        await communicator.disconnect()

    async def test_receive_message(self):
        # Create a WebSocket communicator for testing
        communicator = WebsocketCommunicator(self.consumer, self.ws_path)

        # Connect to the WebSocket
        connected, _ = await communicator.connect()
        self.assertTrue(connected, "WebSocket connection failed")

        # Create message object for sending
        message_obj = {
            "content": "Test message!",
            "username": "Test User",
            "session_id": self.session.id,
            "isChatbot": False,
        }
        await communicator.send_json_to(message_obj)

        # Receive and validate the message from the WebSocket
        response = await communicator.receive_json_from()
        self.assertEqual(
            response["content"],
            message_obj["content"],
            "Received message content does not match sent message content",
        )
        self.assertEqual(
            response["username"],
            message_obj["username"],
            "Received message username does not match sent message username",
        )
        self.assertEqual(
            response["session_id"],
            message_obj["session_id"],
            "Received message session_id does not match sent message session_id",
        )

        # Disconnect
        await communicator.disconnect()
