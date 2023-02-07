import { useCallback, useEffect } from "react";

export interface IhotKeys {
  [index: string]: (e: KeyboardEvent) => void;
}

export const useHotkeys = (hotKeys: IhotKeys, isBlocked = false) => {
  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (isBlocked) return;
      if (Object.keys(hotKeys).find((key) => key === e.key)) {
        e.preventDefault();
        hotKeys[e.key](e);
      }
    },
    [hotKeys, isBlocked]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [keyHandler]);
};
