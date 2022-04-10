import { border, Box, Button, Center, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import "./App.css";

type Click = {
  number: number;
  x: number;
  y: number;
};

function App() {
  const [playId, setPlayId] = useState(0); // generate by server
  const [indicate, setIndicate] = useState(false);
  const [count, setCount] = useState(1);
  const [clicks, setClicks] = useState<Click[]>([]);
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
      <Center mt={8}>
        <Button
          m={4}
          _focus={{ outline: "none" }}
          onClick={() => {
            setCount(1);
            setClicks([]);
            setPlayId(playId + 1);
          }}
        >
          Start / Reset
        </Button>
        <Button m={4} _focus={{ outline: "none" }} onClick={() => {}}>
          Replay
        </Button>
      </Center>
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
        {numbers.map((n) =>
          n < count ? (
            <Center
              key={n}
              fontSize={32}
              _active={indicate ? { transform: "scale(1.2)" } : {}}
              {...(count > 25
                ? {
                    color: "gray.500",
                  }
                : {
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)",
                  })}
              transition="all 0.1s"
              onMouseDown={(ev) => {
                setIndicate(false);
                setClicks([
                  ...clicks,
                  {
                    number: n,
                    x: ev.nativeEvent.offsetX,
                    y: ev.nativeEvent.offsetY,
                  },
                ]);
              }}
            >
              {n}
            </Center>
          ) : (
            <Center
              key={n}
              fontSize={32}
              boxShadow="0 0 4px rgba(0, 0, 0, 0.5)"
              onMouseDown={(ev) => {
                if (n === count) {
                  setCount(n + 1);
                  setIndicate(true);
                }
                setClicks([
                  ...clicks,
                  {
                    number: n,
                    x: ev.nativeEvent.offsetX,
                    y: ev.nativeEvent.offsetY,
                  },
                ]);
              }}
            >
              {n}
            </Center>
          )
        )}
      </SimpleGrid>
    </Box>
  );
}

export default App;
