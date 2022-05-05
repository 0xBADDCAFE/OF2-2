import { Center } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  isActive: boolean;
  onStop: (count: number) => void;
};
const Stopwatch: React.VFC<Props> = ({ isActive, onStop }) => {
  const [time, setTime] = useState(0);
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
  }, [isActive]);

  return (
    <Center minW={16} m={4}>
      {(time / 1000).toFixed(3)}s
    </Center>
  );
};

export default Stopwatch;
