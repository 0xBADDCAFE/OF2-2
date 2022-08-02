import { Box, Center, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { DocumentReference } from "firebase/firestore";
import produce from "immer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { DBRow } from "../../firebase/firestore";
import { generateRandomIndexedArray, subunion } from "../../function";
import { playDetailState } from "../../recoil/atoms";
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
  const [playDetail, setPlayDetail] = useRecoilState(playDetailState);
  // const [playId, setPlayId] = useState(0); // generate by server
  // const [count, setCount] = useState(1);
  // const [clicks, setClicks] = useState<Click[]>([]);
  // const [playState, setPlayState] = useState<PlayState>("prepare");
  const [startAt, setStartAt] = useState<Date>(new Date());
  // Submit 直後はボタンコンポーネント側で disabled 表示に
  // したいので useState を使わない（= submit 時に更新しない）
  const scoreDocRef = useRef<DocumentReference<DBRow<Score>> | null>(null);
  // const numbers = useMemo(() => {
  //   const xs = [...Array(25)].map((_, i) => i + 1);
  //   for (let i = 0; i < xs.length; i++) {
  //     const j = Math.ceil(Math.random() * (xs.length - i)) + i - 1;
  //     [xs[i], xs[j]] = [xs[j], xs[i]];
  //   }
  //   return xs;
  // }, [playId]);

  const onClickCell = useCallback(
    (n: number, count: number) => (c: { x: number; y: number; at: number }) => {
      setPlayDetail(
        produce((draft) => {
          // Update play detail
          if (n === count) {
            // setCount(n + 1);
            draft.score.count++;
            if (n === 25) {
              // setPlayState("finish");
              draft.playState = "finish";
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
          // setClicks((clicks) => [...clicks, click]);
          draft.score.clicks.push(click);
        })
      );
    },
    [startAt]
  );

  const [replayer] = useReplay();
  const [replayPoints, setReplayPoints] = useState<
    Map<number, { x: number; y: number }[]>
  >(new Map());
  useEffect(() => {
    if (playDetail.playState === "replay") {
      replayer.setReplay(playDetail.score.clicks, (c) => {
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
  }, [playDetail.playState]);

  useEffect(
    () => () => {
      setPlayDetail(
        produce((draft) => {
          // Cleanup
          if (draft.playState === "playing" || scoreDocRef.current !== null) {
            draft.playState = "stop";
          }
        })
      );
    },
    []
  );

  return (
    <>
      <Flex mt={8} justifyContent="space-between">
        <Stopwatch
          ms={2}
          isActive={playDetail.playState === "playing"}
          onStop={(count) => {
            console.log(count);
          }}
        />
        <Center>
          <StyledButton
            me={4}
            onClick={() => {
              setPlayDetail(
                produce((draft) => {
                  if (playDetail.playState === "playing") {
                    // setPlayState("stop");
                    draft.playState = "stop";
                  } else {
                    // setCount(1);
                    // setClicks([]);
                    // setPlayId(playId + 1);
                    // setPlayState("playing");
                    draft.score.count = 1;
                    draft.score.clicks = [];
                    draft.score.numbers = generateRandomIndexedArray();
                    draft.playState = "playing";
                  }
                })
              );
              if (playDetail.playState !== "playing") {
                setStartAt(new Date());
                scoreDocRef.current = null;
              }
            }}
          >
            {playDetail.playState === "playing" ? "Stop" : "Start"}
          </StyledButton>
          <StyledButton
            me={2}
            disabled={
              !subunion<PlayState>("replay", "finish").includes(
                playDetail.playState
              )
            }
            onClick={() => {
              setPlayDetail(
                produce((draft) => {
                  if (playDetail.playState !== "replay") {
                    // setPlayState("replay");
                    draft.playState = "replay";
                  } else {
                    // setPlayState("finish");
                    draft.playState = "finish";
                  }
                })
              );
            }}
          >
            {playDetail.playState !== "replay" ? "Replay" : "Stop"}
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
          {playDetail.score.numbers.map((n) => (
            <NumberCell
              key={n}
              n={n}
              count={playDetail.score.count}
              playState={playDetail.playState}
              replayPoints={replayPoints.get(n) ?? null}
              onClick={onClickCell(n, playDetail.score.count)}
            />
          ))}
        </SimpleGrid>
        {subunion<PlayState>("playing", "replay").includes(
          playDetail.playState
        ) ? null : (
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
                  playDetail.playState === "finish" && !scoreDocRef.current
                    ? {
                        userId: user.uid,
                        finishTime: playDetail.score.clicks.slice(-1)[0].time,
                        ...playDetail.score,
                      }
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
