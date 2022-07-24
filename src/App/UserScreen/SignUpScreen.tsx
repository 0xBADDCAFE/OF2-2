import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  User,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import app from "../../firebase/app";

type Props = {
  onRegistered: (user: User) => void;
};

type Inputs = {
  signUpName: string;
  signUpUserId: string;
  signUpPassword: string;
};

const SignUpScreen: React.VFC<Props> = ({ onRegistered }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const toast = useToast();

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          const credential = await createUserWithEmailAndPassword(
            getAuth(app),
            `${values.signUpUserId}@dummy.0xbd.cf`,
            values.signUpPassword
          );
          const user = credential.user;
          if (user) {
            await updateProfile(user, { displayName: values.signUpName });
            onRegistered({ ...user, displayName: values.signUpName });
          }
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
        <FormControl isInvalid={!!errors.signUpName}>
          <FormLabel htmlFor="signUpName">Name</FormLabel>
          <Input
            id="signUpName"
            {...register("signUpName", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.signUpName && errors.signUpName.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.signUpUserId}>
          <FormLabel htmlFor="signUpUserId">User ID</FormLabel>
          <Input
            id="signUpUserId"
            type="text"
            {...register("signUpUserId", {
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
            {errors.signUpUserId && errors.signUpUserId.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.signUpPassword}>
          <FormLabel htmlFor="signUpPassword">Password</FormLabel>
          <Input
            id="signUpPassword"
            type="password"
            {...register("signUpPassword", {
              required: "This is required",
              minLength: {
                value: 6,
                message: "Minimum length should be 6",
              },
            })}
          />
          <FormErrorMessage>
            {errors.signUpPassword && errors.signUpPassword.message}
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
  );
};

export default SignUpScreen;
