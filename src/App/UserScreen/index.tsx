import {
  Box,
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import "firebase/compat/auth";
import app from "../../firebase/app";
import { useUser } from "../hooks";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

type Props = {
  // user: firebase.User | null | undefined;
  // setUser: (user: firebase.User) => void;
};

const UserScreen: React.VFC<Props> = () => {
  const [user, setUser] = useUser();
  return user === undefined ? null : user ? (
    <Box mt={8}>
      <Text>Username: {user.displayName}</Text>
      <Button mt={4} onClick={() => getAuth(app).signOut()}>
        Sign out
      </Button>
    </Box>
  ) : (
    <Box mt={16}>
      <Heading size="md">サインインまたはサインアップで結果を送信</Heading>
      <Tabs mt={2} isFitted>
        <TabList>
          <Tab _focus={{ outline: "none" }}>Sign in</Tab>
          <Tab _focus={{ outline: "none" }}>Sign up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SignInScreen />
          </TabPanel>
          <TabPanel>
            <SignUpScreen onRegistered={(user) => setUser(user)} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserScreen;
