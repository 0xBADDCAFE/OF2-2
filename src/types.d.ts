type Click = {
  number: number;
  x: number;
  y: number;
  time: number;
};

type Score = {
  userId: string;
  numbers: number[];
  clicks: Click[];
  finishTime: number;
};

type User = {
  displayName: string;
};

type PlayState = "prepare" | "playing" | "finish" | "stop" | "replay";
