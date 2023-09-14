"use client";

import { Flex, Icon, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ icon, isActive, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      w="100%"
      justify="center"
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bgColor={isActive ? "#fdede7" : "transparent"}
        _hover={{
          bg: "#fdede7"
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Flex>
  );
};

export default NavItem;
