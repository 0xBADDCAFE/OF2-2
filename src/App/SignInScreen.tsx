import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useForm } from "react-hook-form";
import { firebase } from "../firebase/app";

// Configure FirebaseUI.
const uiConfig: firebaseui.auth.Config = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: "/signedIn",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  callbacks: { signInSuccessWithAuthResult: () => false },
};

const SignInScreen = () => {
  const [isSignedIn, setSignedIn] = useState<boolean>();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return isSignedIn === undefined ? null : isSignedIn ? (
    <Box mt={8}>
      <Text>Username: {firebase.auth().currentUser?.displayName}</Text>
      <Button
        mt={4}
        onClick={() => {
          firebase.auth().signOut();
        }}
      >
        Sign out
      </Button>
    </Box>
  ) : (
    <Box mt={16}>
      <Heading size="md">
        結果を送信するにはサインインまたはサインアップ
      </Heading>
      <Tabs mt={2} isFitted>
        <TabList>
          <Tab _focus={{ outline: "none" }}>Sign in</Tab>
          <Tab _focus={{ outline: "none" }}>Sign up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box mt={4}>
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </Box>
          </TabPanel>
          <TabPanel>
            <form
              onSubmit={handleSubmit((values) => {
                console.log(values);
              })}
            >
              <Flex maxW={360} m="8px auto" direction="column" gap={4}>
                <FormControl isInvalid={errors.signInName}>
                  <FormLabel htmlFor="signInName">Name</FormLabel>
                  <Input
                    id="signInName"
                    {...register("signInName", {
                      required: "This is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.signInName && errors.signInName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.signInUserId}>
                  <FormLabel htmlFor="signInUserId">User ID</FormLabel>
                  <Input
                    id="signInUserId"
                    type="text"
                    {...register("signInUserId", {
                      required: "This is required",
                      minLength: {
                        value: 3,
                        message: "Minimum length should be 3",
                      },
                      pattern: {
                        value: /^[A-Za-z\-\_\.]+$/i,
                        message: "Symbols can use: -_.",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.signInUserId && errors.signInUserId.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.signInPassword}>
                  <FormLabel htmlFor="signInPassword">Password</FormLabel>
                  <Input
                    id="signInPassword"
                    type="password"
                    {...register("signInPassword", {
                      required: "This is required",
                      minLength: {
                        value: 6,
                        message: "Minimum length should be 6",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.signInPassword && errors.signInPassword.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Sign up
                </Button>
              </Flex>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SignInScreen;
