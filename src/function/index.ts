const subunion = <T extends string>(...args: T[]) => args;

const generateRandomIndexedArray = () => {
  const xs = [...Array(25)].map((_, i) => i + 1);
  for (let i = 0; i < xs.length; i++) {
    const j = Math.ceil(Math.random() * (xs.length - i)) + i - 1;
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
};

export { subunion, generateRandomIndexedArray };
