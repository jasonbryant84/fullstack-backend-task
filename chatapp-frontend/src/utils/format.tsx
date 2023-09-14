import { SessionObjType } from "./context";
import { createWebSocket } from "./chatAPI";

const configureSessionObj = async (
  tempSessionObj: SessionObjType,
  isActive?: boolean
) => {
  const newSocket = await createWebSocket(tempSessionObj?.id);

  // Adding properties to server response like WebSocket
  tempSessionObj.socketObj = {
    id: tempSessionObj?.id,
    socket: newSocket,
    onMessageSet: false
  };
  tempSessionObj.isActive = isActive || false;

  return tempSessionObj;
};
const configureSessionObjs = async (tempSessionObjs: SessionObjType[]) => {
  const response = tempSessionObjs.map(async (tempSessionObj) => {
    return await configureSessionObj(tempSessionObj, false);
  });

  return Promise.all(response)
    .then((results) => {
      return results;
    })
    .catch(() => {
      return [];
    });
};

const messageForWebsocket = (
  message: string,
  user: any,
  sessionObj: SessionObjType
) => {
  return {
    content: message,
    username: user?.name,
    user_id: user?.id,
    session_id: sessionObj?.id
  };
};

const isToday = (dateStr: string) => {
  const currentDate = new Date(),
    date = new Date(dateStr);

  return (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
};

const isYesterday = (dateStr: string) => {
  const currentDate = new Date(),
    oneDayAgo = new Date(currentDate.getTime() - 86400000),
    date = new Date(dateStr);

  return (
    date.getDate() === oneDayAgo.getDate() &&
    date.getMonth() === oneDayAgo.getMonth() &&
    date.getFullYear() === oneDayAgo.getFullYear()
  );
};

const formatTimestamp = (dateStr: string) => {
  return {
    timestamp: new Date(dateStr).toLocaleString(),
    isToday: isToday(dateStr)
  };
};

const formatDate = (dateStr: string) => {
  return {
    date: new Date(dateStr).toLocaleDateString(),
    isToday: isToday(dateStr)
  };
};

const formatTime = (dateStr: string) => {
  const formattedTime = new Date(dateStr).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true // Use 12-hour format with AM/PM
  });

  return {
    time: formattedTime,
    isToday: isToday(dateStr),
    isYesterday: isYesterday(dateStr),
    date: formatDate(dateStr)
  };
};

export {
  configureSessionObj,
  configureSessionObjs,
  messageForWebsocket,
  formatTimestamp,
  formatTime,
  formatDate
};
