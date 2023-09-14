from django.urls import path

from . import views


urlpatterns = [
    path("create_user/", views.create_user, name="create_user"),
    path("get_user/", views.get_user, name="get_user"),
    path("create_session/", views.create_session, name="create_session"),
    path("get_sessions/", views.get_sessions, name="get_sessions"),
]
