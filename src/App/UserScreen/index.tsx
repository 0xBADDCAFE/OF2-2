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
import { useEffect, useState } from "react";
import { firebase } from "../../firebase/app";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

const UserScreen = () => {
  const [user, setUser] = useState<firebase.User | null>();

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => setUser(user));
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

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
