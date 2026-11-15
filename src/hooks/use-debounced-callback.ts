import { useCallback, useEffect, useRef } from "react";

export const useDebouncedCallback = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number = 200,
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancel = useCallback(() => clearTimeout(timeoutRef.current), []);

  useEffect(() => cancel, [cancel]);

  const run = (...args: TArgs) => {
    cancel();
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };

  return { run, cancel };
};
