import { Box, Center, Flex, SimpleGrid } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { firebase } from "../firebase/app";
import StyledButton from "../shared/StyledButton";
import NumberCell from "./NumberCell";
import ResultSubmitButton from "./ResultSubmitButton";
import Stopwatch from "./Stopwatch";

type Props = {
  user: firebase.User | null | undefined;
};

const PlayScreen: React.VFC<Props> = ({ user }) => {
  const [playId, setPlayId] = useState(0); // generate by server
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

  return (
    <>
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
            <NumberCell
              key={n}
              playState={playState}
              setPlayState={setPlayState}
              count={count}
              setCount={setCount}
              n={n}
              clicks={clicks}
              setClicks={setClicks}
              startAt={startAt}
            />
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
              />
            ) : null}
          </Center>
        )}
      </Box>
    </>
  );
};

export default PlayScreen;
