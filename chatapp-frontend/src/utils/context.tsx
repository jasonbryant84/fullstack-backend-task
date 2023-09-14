import { ReactNode, createContext, useState } from "react";

export interface UserType {
  id: number | null;
  name: string | null;
  created_timestamp: string | null;
  last_modified_timestamp: string | null;
}

export interface SocketObjType {
  id: string;
  socket: WebSocket;
  onMessageSet: boolean;
}

export interface SessionType {
  id: string;
  user_id: string;
  created_timestamp: string;
  last_modified_timestamp: string;
}

export interface SessionObjType {
  id: string;
  session: SessionType;
  isActive?: boolean; // like defaulting to false
  socketObj: SocketObjType;
  messages: (MessageType | null)[];
}

export interface MessageType {
  id: string;
  content: string;
  isChatbot: boolean;
  session_id: string;
  timestamp: string;
  user_id: string;
  username: string;
}

/*
 * Chat Context
 */
interface ChatContextType {
  user: UserType | null;
  updateUser: Function;
  messages: MessageType[];
  updateMessages: Function;
  updateSessionObjMessages: Function;
  sessionObjs: SessionObjType[];
  updateSessionObjs: Function;
  activeSessionObj: SessionObjType | null;
  updateActiveSessionObj: Function;
}

export const CurrentUserContext = createContext<ChatContextType>({
  user: null,
  updateUser: () => {},
  messages: [],
  updateMessages: () => {},
  updateSessionObjMessages: () => {},
  sessionObjs: [],
  updateSessionObjs: () => {},
  activeSessionObj: null,
  updateActiveSessionObj: () => {}
});

/*
 * Chat Context Provider
 */
interface CurrentUserContextProviderProps {
  children?: ReactNode;
}

const CurrentUserContextProvider = ({
  children
}: CurrentUserContextProviderProps) => {
  // User
  const [user, setUser] = useState<UserType | null>({
      name: "username",
      id: null,
      created_timestamp: null,
      last_modified_timestamp: null
    }),
    updateUser = (newUser: UserType) => {
      setUser(newUser);
    };

  // Messages (for display)
  const [messages, setMessages] = useState<MessageType[]>([]),
    updateMessages = (
      previousMessages: MessageType[],
      newMessage: MessageType | null
    ) => {
      if (newMessage) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        setMessages(previousMessages);
      }
    },
    updateSessionObjMessages = (newMessage: MessageType | null) => {
      return sessionObjs.map((sessionObj) => {
        if (sessionObj.id === activeSessionObj?.id) {
          sessionObj.messages = [...sessionObj.messages, newMessage];
          return sessionObj;
        } else {
          return sessionObj;
        }
      });
    };

  // Sessions Objects
  const [sessionObjs, setSessionObjs] = useState<SessionObjType[]>([]),
    updateSessionObjs = (newSessionObj: SessionObjType[]) => {
      setSessionObjs((prevSessionObjs) => [
        ...newSessionObj,
        ...prevSessionObjs
      ]);
    },
    [activeSessionObj, setActiveSessionObj] = useState<SessionObjType | null>(
      null
    ),
    updateActiveSessionObj = (newActiveSessionObj: SessionObjType) => {
      setActiveSessionObj(newActiveSessionObj);
    };

  return (
    <CurrentUserContext.Provider
      value={{
        user,
        updateUser,
        messages,
        updateMessages,
        updateSessionObjMessages,
        sessionObjs,
        updateSessionObjs,
        activeSessionObj,
        updateActiveSessionObj
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserContextProvider;
