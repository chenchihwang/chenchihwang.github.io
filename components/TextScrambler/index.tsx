import * as React from "react";
import { useInterval, useMounted } from "lib/hooks";
import { getState } from "./utils";

// Ref: https://www.nan.fyi/experiments/scrambled-text

const TextScrambler = ({
  children,
  speed = 0.35,
}: {
  children: string;
  speed?: number;
}) => {
  const mounted = useMounted();
  const size = children.length;

  const [[unscrambled, scrambled], setScrambledText] = React.useState(
    getState(children, size, 0)
  );
  const [windowStart, increment] = React.useReducer((state) => state + 1, 0);
  const finished = windowStart > size;

  useInterval(() => increment(), finished ? null : 30 / speed);
  useInterval(
    () => {
      setScrambledText(getState(children, size, windowStart));
    },
    finished ? null : 30 / speed
  );

  return mounted ? (
    <>
      {unscrambled}
      {scrambled}
    </>
  ) : null;
};

export { TextScrambler };
