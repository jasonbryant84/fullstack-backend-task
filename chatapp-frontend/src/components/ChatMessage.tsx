"use client";

import { Box, Flex, FlexProps, Text, HStack } from "@chakra-ui/react";

interface ChatMessageProps extends FlexProps {
  username: string;
  content: string;
  timeStr: string;
  isChatbot: boolean;
}

const ChatMessage = ({
  username,
  content,
  timeStr,
  isChatbot
}: ChatMessageProps) => {
  const alignment = isChatbot ? "left" : "right";
  const bgColorBubbles = isChatbot ? "#fdede7" : "#b867ac";
  const bgColorText = isChatbot ? "#000" : "#fff";
  const borderRadius = "2xl";
  const bottomRightCornerRadius = isChatbot ? borderRadius : "0";
  const bottomLeftCornerRadius = isChatbot ? "0" : borderRadius;

  return (
    <Flex
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      justify={alignment}
      // px="12"
      py="6"
      // bgColor={bgColor}
    >
      <Box width="100%">
        <Flex justify={alignment}>
          <Box
            maxWidth="80%"
            textAlign="left"
            color={bgColorText}
            bgColor={bgColorBubbles}
            fontWeight="normal"
            rounded={borderRadius}
            borderBottomLeftRadius={bottomLeftCornerRadius}
            borderBottomRightRadius={bottomRightCornerRadius}
            p="4"
          >
            <Text fontSize="md">{content}</Text>
          </Box>
        </Flex>

        <Flex justify={alignment} mt="3">
          <HStack textAlign={alignment}>
            {!isChatbot && <Text fontSize="xs">{timeStr}</Text>}
            <Text fontSize="sm">
              <b>{username}</b>
            </Text>
            {isChatbot && <Text fontSize="xs">{timeStr}</Text>}
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ChatMessage;
