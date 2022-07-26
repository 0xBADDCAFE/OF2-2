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
import { updateProfile } from "firebase/auth";
import "firebase/compat/auth";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../../firebase/auth";
import * as doc from "../../firebase/firestore";
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
  comment: string;
};

const UserScreen: React.VFC<Props> = () => {
  const [user, setUser] = useUser();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ defaultValues: { username: user?.displayName ?? "" } });

  useEffect(() => {
    (async () => {
      if (user) {
        // Workaround for after sign up
        setValue("username", user.displayName ?? "");

        const userMeta = await doc.getUser(user.uid);
        setValue("comment", userMeta?.comment ?? "");
      }
    })();
  }, [user]);

  const onValid = useCallback<SubmitHandler<Inputs>>(async (values) => {
    console.log(values);
    try {
      if (user) {
        // FIXME: Dirty update
        await updateProfile(user, { displayName: values.username });
        setUser({ ...user, displayName: values.username });
        doc.setUser(user.uid, {
          displayName: values.username,
          comment: values.comment,
        });
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
        <FormControl isInvalid={!!errors.comment}>
          <HStack>
            <FormLabel htmlFor="comment">Comment:</FormLabel>
            <Input variant="flushed" id="comment" {...register("comment")} />
            <FormErrorMessage>
              {errors.comment && errors.comment.message}
            </FormErrorMessage>
          </HStack>
        </FormControl>
        <StyledButton
          mt={4}
          type="submit"
          variant="outline"
          isLoading={isSubmitting}
        >
          Update
        </StyledButton>
      </chakra.form>
      <chakra.hr mt={4} />
      <StyledButton mt={4} onClick={() => auth.signOut()}>
        Sign out
      </StyledButton>
    </Box>
  ) : (
    <Box mt={8}>
      <Heading size="md" color="gray.600">
        サインインまたはサインアップで結果を送信
      </Heading>
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
