import { useState } from "react";

const replayState = () => {
  const replayTimers: NodeJS.Timer[] = [];

  const setReplay = (clicks: Click[], updateReplay: (click: Click) => void) => {
    clicks.forEach((c) => {
      replayTimers.push(setTimeout(() => updateReplay(c), c.time));
    });
  };
  const clearReplay = () => {
    replayTimers.forEach((t) => clearTimeout(t));
    replayTimers.length = 0;
  };

  return { setReplay, clearReplay };
};

const useReplay = () => useState(() => replayState());

export { useReplay };
