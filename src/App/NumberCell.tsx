import { Center } from "@chakra-ui/react";
import { useState } from "react";
// import { addScore } from "./browser/indexed-db";

type Props = {
  n: number;
  count: number;
  playState: PlayState;
  onClick: (c: { x: number; y: number; at: number }) => void;
};

const NumberCell: React.VFC<Props> = ({ n, count, playState, onClick }) => {
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
          setIndicate(true);
        }
        onClick({
          x: ev.nativeEvent.offsetX,
          y: ev.nativeEvent.offsetY,
          at: Date.now(),
        });
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
