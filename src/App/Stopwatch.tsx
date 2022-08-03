import { Center } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  isActive: boolean;
  onStop: (count: number) => void;
  setTimeMs: number;
} & React.ComponentProps<typeof Center>;
const Stopwatch: React.VFC<Props> = ({
  isActive,
  onStop,
  setTimeMs,
  ...styles
}) => {
  const [time, setTime] = useState(setTimeMs);
  const startSet = useRef<{ from: Date; tId: NodeJS.Timer } | null>(null);
  useEffect(() => {
    if (isActive) {
      if (startSet.current === null) {
        const tId = setInterval(() => {
          setTime(Date.now() - (startSet.current?.from.getTime() ?? 0));
        }, 100);
        startSet.current = { from: new Date(), tId };
      }
    } else {
      if (startSet.current !== null) {
        const lastTime = Date.now() - startSet.current.from.getTime();
        setTime(lastTime);
        onStop(lastTime);
        clearInterval(startSet.current.tId);
        startSet.current = null;
      }
    }
    return () => {
      if (startSet.current) clearInterval(startSet.current.tId);
    };
  }, [isActive]);

  return (
    <Center minW={16} {...styles}>
      {(time / 1000).toFixed(3)}s
    </Center>
  );
};

export default Stopwatch;
