# Chatbot Backend

This project leverages Django to manage RESTful and WebSocket APIs as well as managing the sqlite database.

Additionally, Poetry was used to setup and manage the virtual environment.

If you would like to see more about the front end click [here](../chatapp-frontend/README.md).

## To Setup the Backend

### Install Poetry (if needed)

Be sure to install Poetry on your machine. If needed you can find the documentation [here](https://python-poetry.org/docs/#installation) on their website.

```
curl -sSL https://install.python-poetry.org | python3 -
```

### Make Migrations (if needed)

In the backend project directory, `chatapp`, first run the following command to setup our database.

Nota bene: You may need to activate the poetry shell with the `poetry shell` before running the commands below. Moreover, if all else fails you can append `poetry run [python command]` as well.

```
python manage.py makemigrations
```

```
python manage.py migrate
```

...and finally, if the above is sorted

### Start Server
```
python manage.py runserver
```

Once the database is initiated and the frontend is running you're ready to use the app. For information on the data models and tables and quick commands to reset the database for a 'fresh' restart on the app read below.

## Models / Tables

### Chat User

Table Name: `chat_user`

There are two users, the human user and the chatbot. The chatbot user is auto created with the first message sent or any message sent if the chatbot user is for some reason missing from the databse. 

A user can have many sessions and many messages.

### Chat Session

Table Name: `chat_session`

A session has a `user` foreign key for the user that created the session.

### Chat Message

Table Name: `chat_message`

A message has a `user` foreign key for the user that created the message and a `session` foreign key for the session in which it was created.

## Testing

Run the following command to run 2 simple tests for the websocket, `chat/tests/test_websocket.py`: `test_connect` and `test_receive_message`:

```
python manage.py test chat
```


## Handy Queries for Kicking the Tires

To install sqlite3 if needed: 

```
brew install sqlite
```

To use sqlite in your terminal:
```
sqlite3 db.sqlite3
```

To delete all the data for a fresh restart to test the app.
```
sqlite> delete from chat_user; delete from chat_session; delete from chat_message;
```

To view the current states of the user, sessions, and messages within the database.
```
sqlite> select * from chat_user; select * from chat_session; select * from chat_message;
```