import { Box } from "@chakra-ui/react";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
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
    <Box mt={8}>プロフィールを表示</Box>
  ) : (
    <Box mt={8}>
      <p>結果を送信するにはサインイン：</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Box>
  );
};

export default SignInScreen;
