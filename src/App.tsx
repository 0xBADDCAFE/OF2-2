import {
  EditIcon,
  HamburgerIcon,
  SunIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  Box,
  chakra,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link, Outlet } from "@tanstack/react-location";
import "./App.css";
import { AppRouter } from "./routes";

function App() {
  return (
    <AppRouter>
      <chakra.nav height={16} boxShadow="0px 2px 2px 0px rgba(0, 0, 0, 0.1)">
        <Flex
          maxW={640}
          h="100%"
          margin="0 auto"
          p={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading color="gray.600">
            <Link to="/">2 号の 2 号</Link>
          </Heading>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              _focus={{ outline: "none" }}
            />
            <MenuList>
              <Link to="/">
                <MenuItem icon={<SunIcon />}>Play</MenuItem>
              </Link>
              <Link to="user">
                <MenuItem icon={<EditIcon />}>User</MenuItem>
              </Link>
              <Link to="leaderboard">
                <MenuItem icon={<TriangleUpIcon />}>Leaderboard</MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </Flex>
      </chakra.nav>

      <Box maxW={640} h="100%" m="0 auto">
        <Outlet />
      </Box>
    </AppRouter>
  );
}

export default App;
