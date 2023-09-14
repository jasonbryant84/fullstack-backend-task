"use client";

import { useContext } from "react";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  useColorModeValue,
  BoxProps,
  Text,
  VStack
} from "@chakra-ui/react";

import { FiPlus, FiMessageSquare } from "react-icons/fi";
import { IconType } from "react-icons";

import NavItem from "./NavItem";
import { CurrentUserContext } from "../utils/context";
import { formatTimestamp, configureSessionObj } from "../utils/format";

import { createSession } from "../utils/chatAPI";

interface Session {
  name: string;
  icon: IconType;
}

interface SidebarProps extends BoxProps {
  linkItems: Session[];
  onClose: () => void;
}

const SidebarContent = ({ linkItems, onClose, ...rest }: SidebarProps) => {
  const {
    user,
    sessionObjs,
    updateSessionObjs,
    activeSessionObj,
    updateActiveSessionObj
  } = useContext(CurrentUserContext);

  const handleSetSession = (sessionObjID: string) => {
    const tempActiveSessionObjArray = sessionObjs?.filter((sessionObj) => {
      return sessionObj.id === sessionObjID;
    });
    const tempActiveSessionObj = tempActiveSessionObjArray[0];

    updateActiveSessionObj(tempActiveSessionObj);
  };

  const handleNewChat = async () => {
    if (!user?.id || sessionObjs.length === 0) return;

    // Create session in the database
    let { sessionObj: tempSessionObj } = await createSession(user);

    // Create correspondings session Object
    tempSessionObj = await configureSessionObj(tempSessionObj, true);

    // State management
    updateSessionObjs([tempSessionObj]);
    updateActiveSessionObj(tempSessionObj);
  };

  return (
    <Box
      transition="3s ease"
      bgColor="#fcf9f7"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <img
          src="https://sepana.io/_next/image?url=%2Fimages%2Fsepana-logo.png&w=1920&q=75"
          alt="Sepana Logo"
          style={{ maxWidth: 175 }}
        />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Flex justify="center" w="100%">
        <Button
          mt="4"
          leftIcon={<FiPlus />}
          colorScheme="#ff855b"
          variant="outline"
          mb="4"
          onClick={() => handleNewChat()}
          _hover={{
            opacity: 0.5
          }}
        >
          New chat
        </Button>
      </Flex>
      <Flex
        alignContent="center"
        w="100%"
        style={{ overflowY: "scroll", height: "calc(100vh - 152px)" }}
        direction="column"
      >
        {sessionObjs?.map((sessionObj) => {
          const sessionObjId = sessionObj?.session?.id;
          const { timestamp } = formatTimestamp(
            sessionObj?.session?.created_timestamp
          );

          return (
            <NavItem
              key={sessionObjId}
              icon={FiMessageSquare}
              isActive={sessionObjId === activeSessionObj?.id}
              onClick={() => handleSetSession(sessionObjId)}
              style={{ maxWidth: 207 }}
            >
              <VStack>
                <Text as="b" style={{ lineHeight: 1 }}>
                  Session {sessionObjId}
                </Text>
                <Text fontSize="xs" style={{ lineHeight: 1 }}>
                  {timestamp}
                </Text>
              </VStack>
            </NavItem>
          );
        })}
      </Flex>
    </Box>
  );
};

export default SidebarContent;
