import {
  MakeGenerics,
  ReactLocation,
  Route,
  Router,
} from "@tanstack/react-location";
import { User } from "firebase/auth";
import LeaderboardScreen from "./App/LeaderboardScreen";
import PlayScreen from "./App/PlayScreen";
import UserScreen from "./App/UserScreen";
import { onAuthStateChanged } from "./firebase/auth";

type Props = {
  children: React.ReactNode;
};

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    user: User | null;
  };
  Search: {
    p?: number;
  };
}>;

const location = new ReactLocation<LocationGenerics>();

const loadUser = () =>
  new Promise<User | null>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

// TODO: Loader generics
const routes: Route<LocationGenerics>[] = [
  {
    path: "/",
    element: <PlayScreen />,
    loader: async () => ({
      user: await loadUser(),
    }),
  },
  {
    path: "user",
    element: <UserScreen />,
    loader: async () => ({
      user: await loadUser(),
    }),
  },
  {
    path: "leaderboard",
    element: <LeaderboardScreen />,
  },
];

const AppRouter = ({ children }: Props) => (
  <Router children={children} location={location} routes={routes} />
);

export { AppRouter };
