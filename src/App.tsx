import { Box, Center, Flex, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ResultSubmitButton from "./App/ResultSubmitButton";
import Stopwatch from "./App/Stopwatch";
import UserScreen from "./App/UserScreen";
import { firebase } from "./firebase/app";
import doc from "./firebase/firestore";
import StyledButton from "./shared/StyledButton";
import { addScore } from "./browser/indexed-db";

type PlayState = "prepare" | "playing" | "finish" | "stop";

function App() {
  const [playId, setPlayId] = useState(0); // generate by server
  const [indicate, setIndicate] = useState(false);
  const [count, setCount] = useState(1);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [playState, setPlayState] = useState<PlayState>("prepare");
  const [startAt, setStartAt] = useState<Date>(new Date());
  const numbers = useMemo(() => {
    const xs = [...Array(25)].map((_, i) => i + 1);
    for (let i = 0; i < xs.length; i++) {
      const j = Math.ceil(Math.random() * (xs.length - i)) + i - 1;
      [xs[i], xs[j]] = [xs[j], xs[i]];
    }
    return xs;
  }, [playId]);

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

  const onSubmitComplete = () => {};

  return (
    <Box maxW={640} h="100%" m="0 auto">
      <Flex mt={8} justifyContent="space-between">
        <Stopwatch
          isActive={playState === "playing"}
          onStop={(count) => {
            console.log(count);
          }}
        />
        <Center>
          <StyledButton
            m={4}
            onClick={() => {
              if (playState === "playing") {
                setPlayState("stop");
              } else {
                setCount(1);
                setClicks([]);
                setPlayId(playId + 1);
                setPlayState("playing");
                setStartAt(new Date());
              }
            }}
          >
            {playState === "playing" ? "Stop" : "Start"}
          </StyledButton>
          <StyledButton
            m={4}
            disabled={playState !== "finish"}
            onClick={() => {}}
          >
            Replay
          </StyledButton>
        </Center>
      </Flex>
      <Box
        h="100vw"
        w="100%"
        maxW={390}
        maxH={390}
        m="0 auto"
        mt={8}
        position="relative"
        boxSizing="border-box"
      >
        <SimpleGrid h="100%" w="100%" columns={5} gap={0.5} userSelect="none">
          {numbers.map((n) => (
            <Center
              key={n}
              fontSize={32}
              onMouseDown={(ev) => {
                if (playState !== "playing") {
                  return;
                } else if (n < count) {
                  setIndicate(false);
                } else if (n === count) {
                  setCount(n + 1);
                  setIndicate(true);
                  if (n === 25) {
                    setPlayState("finish");
                    // userId is placeholder to share Score type with firestore
                    addScore({ userId: user?.uid ?? "", numbers, clicks });
                  }
                }
                setClicks([
                  ...clicks,
                  {
                    number: n,
                    x: ev.nativeEvent.offsetX,
                    y: ev.nativeEvent.offsetY,
                    time: Date.now() - startAt.getTime(),
                  },
                ]);
              }}
              {...(playState !== "playing"
                ? {
                    color: "gray.300",
                    transition: "all 0.1s",
                    _active: indicate ? { transform: "scale(1.2)" } : {},
                  }
                : {
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)",
                    ...(n < count
                      ? {
                          transition: "all 0.1s",
                          _active: indicate ? { transform: "scale(1.2)" } : {},
                        }
                      : {}),
                  })}
            >
              {playState !== "prepare" ? n : null}
            </Center>
          ))}
        </SimpleGrid>
        {playState === "playing" ? null : (
          <Center
            w="100%"
            h="100%"
            bgColor="rgba(0, 0, 0, 0.1)"
            position="absolute"
            left={0}
            top={0}
            boxShadow="0 0 4px rgba(0, 0, 0, 0.5)"
            // backdropFilter="blur(2px)"
            flexDirection="column"
            justifyContent="space-evenly"
          >
            {user ? (
              <ResultSubmitButton
                score={
                  playState === "finish"
                    ? { userId: user.uid, numbers, clicks }
                    : null
                }
                onComplete={onSubmitComplete}
              />
            ) : null}
          </Center>
        )}
      </Box>
      <UserScreen user={user} setUser={setUser} />
    </Box>
  );
}

export default App;
