import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";
import PlayScreen from "./App/PlayScreen";
import UserScreen from "./App/UserScreen";
import { firebase } from "./firebase/app";
import * as doc from "./firebase/firestore";

function App() {
  const [user, setUser] = useState<firebase.User | null>();

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        console.log(user?.uid);
        if (user?.uid) {
          const docUser = await doc.getUser(user.uid);
          console.log(docUser);
          if (docUser === null) {
            await doc.setUser(user.uid, {
              displayName: user.displayName ?? "",
            });
            // await doc.addUser({
            //   displayName: user.displayName ?? "",
            // });
          }
        }
        return setUser(user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <Box maxW={640} h="100%" m="0 auto">
      <PlayScreen user={user} />
      <UserScreen user={user} setUser={setUser} />
    </Box>
  );
}

export default App;
