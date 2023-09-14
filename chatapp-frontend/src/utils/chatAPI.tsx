import axios from "axios";
import { UserType } from "./context";

export interface SessionProps {
  id: string;
  createdTimestamp: string | null;
}

// APIs
const createWebSocket = async (sessionID: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const url = `ws://127.0.0.1:8000/ws/chat/session_${sessionID}/`;
    const socket = new WebSocket(url);

    socket.addEventListener("open", () => {
      resolve(socket);
    });

    socket.addEventListener("error", (error) => {
      reject(error);
    });
  });
};

const createUser = async (user: UserType | null) => {
  if (!user) return;

  return axios
    .post("http://127.0.0.1:8000/chat/create_user/", user)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getUser = async (user: UserType | null) => {
  if (!user) return;

  return axios
    .get("http://127.0.0.1:8000/chat/get_user/", { params: user })
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const createSession = async (user: UserType | null) => {
  if (!user) return;

  return axios
    .post("http://127.0.0.1:8000/chat/create_session/", user)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getSessions = async (user: UserType | null) => {
  if (!user) return;

  return axios
    .get("http://127.0.0.1:8000/chat/get_sessions/", { params: user })
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export { createWebSocket, createUser, getUser, createSession, getSessions };
