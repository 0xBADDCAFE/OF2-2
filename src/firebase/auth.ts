import { getAuth, User } from "firebase/auth";
import * as doc from "../firebase/firestore";
import app from "./app";

const onAuthStateChanged = (callback: (user: User | null) => void) =>
  getAuth(app).onAuthStateChanged(async (user) => {
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

    callback(user);
  });

export { onAuthStateChanged };
