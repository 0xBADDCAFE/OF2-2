import { Center } from "@chakra-ui/react";
import { useState } from "react";
// import { addScore } from "./browser/indexed-db";

type Props = {
  playState: PlayState;
  setPlayState: (playState: PlayState) => void;
  n: number;
  count: number;
  setCount: (count: number) => void;
  clicks: Click[];
  setClicks: (clicks: Click[]) => void;
  startAt: Date;
};

const NumberCell: React.VFC<Props> = ({
  playState,
  setPlayState,
  n,
  count,
  setCount,
  clicks,
  setClicks,
  startAt,
}) => {
  const [indicate, setIndicate] = useState(false);
  return (
    <Center
      fontSize={32}
      onMouseDown={async (ev) => {
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
            // Temporally disable local score because of avoid redundant with servers
            // addScore({ userId: user?.uid ?? "", numbers, clicks });
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
  );
};

export default NumberCell;
