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
import "firebase/compat/auth";
import { firebase } from "../../firebase/app";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

type Props = {
  user: firebase.User | null | undefined;
  setUser: (user: firebase.User) => void;
};

const UserScreen: React.VFC<Props> = ({ user, setUser }) => {
  return user === undefined ? null : user ? (
    <Box mt={8}>
      <Text>Username: {user.displayName}</Text>
      <Button mt={4} onClick={() => firebase.auth().signOut()}>
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
