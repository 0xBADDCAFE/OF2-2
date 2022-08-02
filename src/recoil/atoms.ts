import { atom } from "recoil";
import { generateRandomIndexedArray } from "../function";

type PlayDetail = {
  playState: PlayState;
  score: {
    count: number;
    clicks: Click[];
    numbers: number[];
  };
};

const playDetailState = atom<PlayDetail>({
  key: "PlayDetail",
  default: {
    playState: "prepare",
    score: {
      count: 0,
      clicks: [],
      numbers: generateRandomIndexedArray(),
    },
  },
});

export { playDetailState };
