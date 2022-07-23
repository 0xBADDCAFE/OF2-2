import { getAuth, signOut, User } from "firebase/auth";
import * as doc from "../firebase/firestore";
import app from "./app";

const onAuthStateChanged = (callback: (user: User | null) => void) =>
  getAuth(app).onAuthStateChanged(async (user) => {
    if (user?.uid) {
      const docUser = await doc.getUser(user.uid);
      if (docUser === null || docUser.displayName !== user.displayName) {
        await doc.setUser(user.uid, {
          displayName: user.displayName ?? "",
          comment: "",
        });
        // await doc.addUser({
        //   displayName: user.displayName ?? "",
        // });
      }
    }

    callback(user);
  });

const signOutUser = () => signOut(getAuth(app));

export { onAuthStateChanged, signOutUser };
