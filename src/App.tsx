import { Box, Button, Center, Flex, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import "./App.css";
import Stopwatch from "./App/Stopwatch";

type Click = {
  number: number;
  x: number;
  y: number;
  time: number;
};

function App() {
  const [playId, setPlayId] = useState(0); // generate by server
  const [indicate, setIndicate] = useState(false);
  const [count, setCount] = useState(1);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [isPlaying, setPlaying] = useState(false);
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
    <Box maxW={640} h="100vh" m="0 auto">
      <Flex mt={8} justifyContent="space-around">
        <Stopwatch
          isActive={isPlaying}
          onStop={(count) => {
            console.log(count);
          }}
        />
        <Center>
          <Button
            m={4}
            _focus={{ outline: "none" }}
            onClick={() => {
              if (isPlaying) {
                setPlaying(false);
              } else {
                setCount(1);
                setClicks([]);
                setPlayId(playId + 1);
                setPlaying(true);
                setStartAt(new Date());
              }
            }}
          >
            {isPlaying ? "Stop" : "Start"}
          </Button>
          <Button
            m={4}
            disabled={isPlaying || clicks.length == 0}
            _focus={{ outline: "none" }}
            onClick={() => {}}
          >
            Replay
          </Button>
        </Center>
      </Flex>
      <SimpleGrid
        h="100%"
        w="100%"
        maxW={390}
        maxH={390}
        m="0 auto"
        mt={8}
        boxSizing="border-box"
        columns={5}
        gap={0.5}
        userSelect="none"
      >
        {numbers.map((n) => (
          <Center
            key={n}
            fontSize={32}
            onMouseDown={(ev) => {
              if (!isPlaying) {
                return;
              } else if (n < count) {
                setIndicate(false);
              } else if (n === count) {
                setCount(n + 1);
                setIndicate(true);
                if (n === 25) {
                  setPlaying(false);
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
            {...(n < count
              ? {
                  ...(25 < count
                    ? { color: "gray.500" }
                    : { boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)" }),
                  transition: "all 0.1s",
                  _active: indicate ? { transform: "scale(1.2)" } : {},
                }
              : { boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)" })}
          >
            {isPlaying || clicks.length > 0 ? n : null}
          </Center>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default App;
