import { Box, Center, keyframes } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { subunion } from "../../function";
// import { addScore } from "./browser/indexed-db";

type Props = {
  n: number;
  count: number;
  playState: PlayState;
  replayPoints: { x: number; y: number }[] | null;
  onClick: (c: { x: number; y: number; at: number }) => void;
};

const RIPPLE_RADIUS_PX = 24;

const NumberCell: React.VFC<Props> = ({
  n,
  count,
  playState,
  replayPoints,
  onClick,
}) => {
  const [indicate, setIndicate] = useState(false);

  useEffect(() => {
    setIndicate(false);
  }, [playState]);

  const rippleKeyframes = keyframes`
  from {
    opacity: 1;
  }
  to {
    transform: scale(${n !== 25 ? "2" : "5"});
    opacity: 0;
  }`;

  return (
    <Center
      pos="relative"
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
      {...(!subunion<PlayState>("playing", "replay").includes(playState)
        ? {
            color: "gray.300",
            transition: "all 0.1s",
            // for last cell
            // _active: indicate ? { transform: "scale(1.2)" } : {},
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
      {replayPoints
        ? replayPoints.map((p, i) => (
            <Box
              key={i}
              as="span"
              w={`${RIPPLE_RADIUS_PX * 2}px`}
              h={`${RIPPLE_RADIUS_PX * 2}px`}
              bgColor="blackAlpha.200"
              position="absolute"
              borderRadius="100%"
              pointerEvents="none"
              transform="scale(0.1)"
              // opacity={1}
              left={`${p.x - RIPPLE_RADIUS_PX}px`}
              top={`${p.y - RIPPLE_RADIUS_PX}px`}
              animation={`${rippleKeyframes} 0.5s ease-out`}
            />
          ))
        : null}
    </Center>
  );
};

export default NumberCell;
