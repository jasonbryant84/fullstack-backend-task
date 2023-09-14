"use client";

import { useContext, useEffect, useRef, useState } from "react";

import { Button, Box, HStack, Input, Flex, Text } from "@chakra-ui/react";

import SidebarWithHeader from "./components/SidebarWithHeader";
import ChatMessage from "./components/ChatMessage";
import {
  createUser,
  getUser,
  createSession,
  getSessions
} from "./utils/chatAPI";
import {
  formatTime,
  messageForWebsocket,
  configureSessionObj,
  configureSessionObjs
} from "./utils/format";
import { CurrentUserContext } from "./utils/context";

function Chat() {
  const {
    user,
    updateUser,
    messages,
    updateMessages,
    updateSessionObjMessages,
    sessionObjs,
    updateSessionObjs,
    activeSessionObj,
    updateActiveSessionObj
  } = useContext(CurrentUserContext);

  const initiatedRef = useRef<boolean | null>(false);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [localMessage, setLocalMessage] = useState("");

  const handleInputUpdate = (input: string) => {
    setLocalMessage(input);
  };

  // Active Sessions Updated
  useEffect(() => {
    updateMessages(activeSessionObj?.messages);
  }, [activeSessionObj, updateMessages]);

  // []
  useEffect(() => {
    if (!initiatedRef.current && !activeSessionObj) {
      (async () => {
        const response = await getUser(user);
        if (!response) return;

        const { user: tempUser } = response;

        // If we have a user in the database...
        if (tempUser) {
          updateUser(tempUser);

          const { sessionObjs: tempSessionObjs } = await getSessions(tempUser);

          // If we have session objects associated with the user...
          if (tempSessionObjs?.length) {
            // Configure and set all Session Objects
            const configuredSessionObjs =
              await configureSessionObjs(tempSessionObjs);
            updateSessionObjs(configuredSessionObjs);
            updateActiveSessionObj(configuredSessionObjs[0]); // Activate first Session
          }
        }
      })();

      initiatedRef.current = true;
    }
  }, [
    activeSessionObj,
    updateActiveSessionObj,
    updateSessionObjs,
    updateUser,
    user
  ]);

  // activeSessionObj updated
  useEffect(() => {
    if (activeSessionObj && !activeSessionObj?.socketObj?.onMessageSet) {
      activeSessionObj.socketObj.onMessageSet = true;

      activeSessionObj.socketObj.socket.onopen = (ev: Event) => {
        console.log("Web Socket is connected", ev);
      };

      activeSessionObj.socketObj.socket.onerror = (e) => {
        console.error("error", e);
      };

      activeSessionObj.socketObj.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateMessages(messages, data); // for display
        updateSessionObjMessages(data); // into memory
      };
    }
  }, [activeSessionObj, messages, updateMessages, updateSessionObjMessages]);

  // messages updated
  useEffect(() => {
    if (messages?.length) {
      chatBoxRef.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages]);

  const handleFirstMessage = async () => {
    // Create new user in the database
    const response = await createUser(user);
    if (!response) return;

    const { user: tempUser } = response;

    if (!tempUser) return;

    updateUser(tempUser);

    // Create first session in the database
    let { sessionObj: tempSessionObj } = await createSession(tempUser);

    // Create correspondings session Object
    tempSessionObj = await configureSessionObj(tempSessionObj, true);

    // State management
    updateSessionObjs([tempSessionObj]);
    updateActiveSessionObj(tempSessionObj);

    // Send message via Websocket
    const data = messageForWebsocket(localMessage, user, tempSessionObj);
    tempSessionObj.socketObj.socket.send(JSON.stringify(data));
    setLocalMessage("");
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (localMessage.length === 0 || !user) return;

    // If first user message (no session yet created)
    if (sessionObjs?.length === 0 || !user) {
      handleFirstMessage();
      initiatedRef.current = true;
      return;
    }

    // If socket is configured and we have a message
    if (localMessage && activeSessionObj?.socketObj) {
      const data = messageForWebsocket(localMessage, user, activeSessionObj);
      activeSessionObj?.socketObj?.socket.send(JSON.stringify(data));
      setLocalMessage("");
    }
  };

  return (
    <div className="chat-container">
      <SidebarWithHeader>
        <Flex direction="column" h="calc(100vh - 80px)">
          <Box
            h="calc(100vh - 184px)"
            w="100%"
            px="9"
            overflowY="scroll"
            bgColor="white"
            ref={chatBoxRef}
          >
            {sessionObjs?.length === 0 && (
              <Text my="6">First chat? Simply send a message below.</Text>
            )}
            {messages?.map((currMessage, index) => {
              const {
                time,
                isToday,
                isYesterday,
                date: dateObj
              } = formatTime(currMessage?.timestamp);
              const timeStr = `${time}${
                isToday
                  ? " Today"
                  : isYesterday
                  ? " Yesterday"
                  : ` ${dateObj.date}`
              }`;

              return (
                <ChatMessage
                  key={index}
                  username={currMessage?.username || "no username"}
                  content={currMessage?.content || "no content"}
                  timeStr={timeStr}
                  isChatbot={currMessage?.isChatbot || false}
                />
              );
            })}
          </Box>

          <Box py="8" px="9">
            <form onSubmit={handleSubmit}>
              <HStack spacing={{ base: "0", md: "6" }}>
                <Input
                  type="text"
                  variant="outline"
                  placeholder="Type a message..."
                  value={localMessage} // avoid rerender on key strokes
                  size="lg"
                  onChange={(event) => handleInputUpdate(event.target.value)}
                />

                <Button
                  type="submit"
                  bg="#ffc2ad"
                  color="#272727"
                  size="lg"
                  ml="3"
                  _hover={{ bg: "#ff855b" }}
                >
                  Send
                </Button>
              </HStack>
            </form>
          </Box>
        </Flex>
      </SidebarWithHeader>
    </div>
  );
}
export default Chat;
