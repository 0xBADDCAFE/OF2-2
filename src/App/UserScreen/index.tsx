import {
  Box,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import "firebase/compat/auth";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import app from "../../firebase/app";
import StyledButton from "../../shared/StyledButton";
import { useUser } from "../hooks";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

type Props = {
  // user: firebase.User | null | undefined;
  // setUser: (user: firebase.User) => void;
};

type Inputs = {
  username: string;
};

const UserScreen: React.VFC<Props> = () => {
  const [user, setUser] = useUser();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ defaultValues: { username: user?.displayName ?? "" } });

  const onValid = useCallback<SubmitHandler<Inputs>>(async (values) => {
    console.log(values);
    try {
      if (user) {
        await updateProfile(user, { displayName: values.username });
        setUser({ ...user, displayName: values.username });
        toast({ title: "Updated" });
      }
    } catch (e) {
      console.error(e);
      if (e instanceof FirebaseError) {
        toast({
          title: "Username cannot change.",
          status: "error",
          description: e.message,
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, []);

  return user ? (
    <Box mt={8} ms={2} me={2}>
      <chakra.form onSubmit={handleSubmit(onValid)}>
        <HStack>
          <FormControl isInvalid={!!errors.username}>
            <HStack>
              <FormLabel htmlFor="username">Username:</FormLabel>
              <Input
                variant="flushed"
                id="username"
                {...register("username", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </HStack>
          </FormControl>
          <StyledButton
            type="submit"
            variant="outline"
            isLoading={isSubmitting}
          >
            Update
          </StyledButton>
        </HStack>
      </chakra.form>
      <StyledButton mt={4} onClick={() => getAuth(app).signOut()}>
        Sign out
      </StyledButton>
    </Box>
  ) : (
    <Box mt={8}>
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
            <SignUpScreen
              onRegistered={(user) => {
                // Workaround to show displayName
                return setUser(user);
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserScreen;
