import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useForm } from "react-hook-form";
import { firebase } from "../../firebase/app";

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

type Props = {};
type Inputs = {
  signInUserId: string;
  signInPassword: string;
};

const SignInScreen: React.VFC<Props> = ({}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const toast = useToast();

  return (
    <>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await firebase
              .auth()
              .signInWithEmailAndPassword(
                `${values.signInUserId}@0xbd.cf`,
                values.signInPassword
              );
          } catch (e) {
            console.error(e);
            if (e instanceof FirebaseError) {
              toast({
                title: "Sign up error.",
                status: "error",
                description: e.message,
                duration: 9000,
                isClosable: true,
              });
            }
          }
        })}
      >
        <Flex maxW={360} m="8px auto" direction="column" gap={4}>
          <FormControl isInvalid={!!errors.signInUserId}>
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
                  value: /^[A-Za-z0-9\-\_\.]+$/i,
                  message: "Symbols can use: -_.",
                },
              })}
            />
            <FormErrorMessage>
              {errors.signInUserId && errors.signInUserId.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.signInPassword}>
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
            Sign in
          </Button>
        </Flex>
      </form>

      <Box mt={8}>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Box>
    </>
  );
};

export default SignInScreen;
