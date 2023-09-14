import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Message, ChatSession, User
from .serializers import ChatSessionSerializer, UserSerializer


@csrf_exempt
def create_user(request):
    """Creating the user executed for the first ever message sent from the client"""

    if request.method == "POST":
        data = json.loads(request.body)
        username = data["name"]

        user = User.objects.create(name=username)

        if user:
            return JsonResponse({"user": UserSerializer(user).data}, status=200)

        return JsonResponse({"error": "user not created"})

    return JsonResponse({"error": "only POST requests allowed"})


def get_user(request):
    """Retrieve the user. Executed when the user loads the app at localhost:3000"""

    if request.method == "GET":
        username = request.GET.get("name", None)

        try:
            user = User.objects.get(name=username)
            return JsonResponse({"user": UserSerializer(user).data}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"user": None}, status=200)

    return JsonResponse({"error": "only GET requests allowed"})


@csrf_exempt
def create_session(request):
    """
    Creates a new session for the user indicated when the first message is sent
    or when a new chat is triggered
    """

    if request.method == "POST":
        data = json.loads(request.body)
        username = data["name"]

        user = User.objects.get(name=username)
        session = ChatSession.objects.create(user=user)

        session_obj = {
            "id": session.id,
            "session": ChatSessionSerializer(session).data,
            "messages": [],
        }

        if session:
            return JsonResponse(
                {
                    "session": ChatSessionSerializer(session).data,
                    "sessionObj": session_obj,
                },
                status=200,
            )

        return JsonResponse({"error": "session not created"})

    return JsonResponse({"error": "only POST requests allowed"})


def get_sessions(request):
    """Retrieving the sessions associated with a given client side user"""

    if request.method == "GET":
        username = request.GET.get("name", None)

        try:
            user = User.objects.get(name=username)
            chatbot = User.objects.get(name="chatbot")
            sessions = (
                ChatSession.objects.all()
                .filter(user=user)
                .order_by("-last_modified_timestamp")
            )

            session_objs = []
            for session in sessions:
                messages_list = list(
                    Message.objects.all().filter(session=session).values()
                )

                # Introducing a flag to indicate whether message is from chatbot or not
                messages_list = [
                    dict(item, **{"isChatbot": item["user_id"] == chatbot.id})
                    for item in messages_list
                ]

                session_objs.append(
                    {
                        "id": session.id,
                        "session": ChatSessionSerializer(session).data,
                        "messages": messages_list,
                    }
                )

            return JsonResponse(
                {
                    "sessionObjs": session_objs,
                    "user": UserSerializer(user).data,
                },
                status=200,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "Error creating/retrieving user"})

        except ChatSession.DoesNotExist:
            return JsonResponse(
                {
                    "sessions": [],
                    "error": "Error creating/retrieving sessions for user",
                },
                status=200,
            )

    return JsonResponse({"error": "only GET requests allowed"})
