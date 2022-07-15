import { chakra } from "@chakra-ui/react";
import { Link } from "@tanstack/react-location";

const ChakraLink = chakra(Link);

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof ChakraLink>;

const StyledLink = (props: Props) => (
  <ChakraLink
    color="teal.300"
    _hover={{ color: "teal.500", textDecorationLine: "underline" }}
    _visited={{ color: "teal.500" }}
    {...props}
  />
);

export default StyledLink;
