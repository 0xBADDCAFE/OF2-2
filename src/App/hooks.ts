import { useMatch } from "@tanstack/react-location";
import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { onAuthStateChanged } from "../firebase/auth";
import { LocationGenerics } from "../routes";

const useUser = (): [User | null, Dispatch<SetStateAction<User | null>>] => {
  const {
    data: { user: loadedUser },
  } = useMatch<LocationGenerics>();
  const [user, setUser] = useState<User | null>(loadedUser ?? null);
  useEffect(
    () =>
      onAuthStateChanged(async (newUser) => {
        // console.log(user);
        setUser(newUser);
      }),
    []
  );

  return [user, setUser];
};

export { useUser };
