import { Box, Center, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { DocumentReference } from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DBRow } from "../../firebase/firestore";
import { subunion } from "../../function";
import StyledButton from "../../shared/StyledButton";
import StyledLink from "../../shared/StyledLink";
import { useUser } from "../hooks";
import ResultSubmitButton from "../ResultSubmitButton";
import Stopwatch from "../Stopwatch";
import { useReplay } from "./hooks";
import NumberCell from "./NumberCell";

type Props = {
  // user: firebase.User | null | undefined;
};

const PlayScreen: React.VFC<Props> = () => {
  const [user] = useUser();
  const [playId, setPlayId] = useState(0); // generate by server
  const [count, setCount] = useState(1);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [playState, setPlayState] = useState<PlayState>("prepare");
  const [startAt, setStartAt] = useState<Date>(new Date());
  // Submit 直後はボタンコンポーネント側で disabled 表示に
  // したいので useState を使わない（= submit 時に更新しない）
  const scoreDocRef = useRef<DocumentReference<DBRow<Score>> | null>(null);
  const numbers = useMemo(() => {
    const xs = [...Array(25)].map((_, i) => i + 1);
    for (let i = 0; i < xs.length; i++) {
      const j = Math.ceil(Math.random() * (xs.length - i)) + i - 1;
      [xs[i], xs[j]] = [xs[j], xs[i]];
    }
    return xs;
  }, [playId]);

  const onClickCell = useCallback(
    (n: number, count: number) => (c: { x: number; y: number; at: number }) => {
      if (n === count) {
        setCount(n + 1);
        if (n === 25) {
          setPlayState("finish");
          // userId is placeholder to share Score type with firestore
          // Temporally disable local score because of avoid redundant with servers
          // addScore({ userId: user?.uid ?? "", numbers, clicks });
        }
      }

      const click: Click = {
        number: n,
        x: c.x,
        y: c.y,
        time: c.at - startAt.getTime(),
      };
      setClicks((clicks) => [...clicks, click]);
    },
    [startAt]
  );

  const [replayer] = useReplay();
  const [replayPoints, setReplayPoints] = useState<
    Map<number, { x: number; y: number }[]>
  >(new Map());
  useEffect(() => {
    if (playState === "replay") {
      replayer.setReplay(clicks, (c) => {
        const numberPoints = replayPoints.get(c.number) ?? [];
        setReplayPoints(
          new Map(replayPoints.set(c.number, [...numberPoints, { ...c }]))
        );
      });
    } else {
      replayer.clearReplay();
      setReplayPoints(new Map());
    }
    return replayer.clearReplay;
  }, [playState]);

  return (
    <>
      <Flex mt={8} justifyContent="space-between">
        <Stopwatch
          ms={2}
          isActive={playState === "playing"}
          onStop={(count) => {
            console.log(count);
          }}
        />
        <Center>
          <StyledButton
            me={4}
            onClick={() => {
              if (playState === "playing") {
                setPlayState("stop");
              } else {
                setCount(1);
                setClicks([]);
                setPlayId(playId + 1);
                setPlayState("playing");
                setStartAt(new Date());
                scoreDocRef.current = null;
              }
            }}
          >
            {playState === "playing" ? "Stop" : "Start"}
          </StyledButton>
          <StyledButton
            me={2}
            disabled={
              !subunion<PlayState>("replay", "finish").includes(playState)
            }
            onClick={() => {
              if (playState !== "replay") {
                setPlayState("replay");
              } else {
                setPlayState("finish");
              }
            }}
          >
            {playState !== "replay" ? "Replay" : "Stop"}
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
              n={n}
              count={count}
              playState={playState}
              replayPoints={replayPoints.get(n) ?? null}
              onClick={onClickCell(n, count)}
            />
          ))}
        </SimpleGrid>
        {subunion<PlayState>("playing", "replay").includes(playState) ? null : (
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
                  playState === "finish" && !scoreDocRef.current
                    ? { userId: user.uid, numbers, clicks }
                    : null
                }
                onSubmitted={(docRef) => (scoreDocRef.current = docRef)}
              />
            ) : null}
          </Center>
        )}
      </Box>
      <Box mt={4} ms={2} me={2}>
        {user ? (
          <Text>
            Username: <StyledLink to="user">{user.displayName}</StyledLink>
          </Text>
        ) : (
          <Text>
            <StyledLink to="user">サインインまたはサインアップ</StyledLink>
            で結果を送信
          </Text>
        )}
      </Box>
    </>
  );
};

export default PlayScreen;
