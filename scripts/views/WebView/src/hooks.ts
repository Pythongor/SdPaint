import { useEffect, useCallback, RefObject } from "react";

const TEXT_INPUTS_TYPES = ["text", "number"];

type KeyCallback = (
  event: KeyboardEvent,
  options?: { blockInputs?: boolean }
) => void;

type HotkeyMapType = {
  [key: string]:
    | { func: KeyCallback; options?: { blockInputs?: boolean } }
    | KeyCallback;
};

const getMapKey = (event: KeyboardEvent) => {
  const { ctrlKey, shiftKey, altKey, code } = event;
  if ([ctrlKey, shiftKey, altKey].every((k) => !k)) return code;
  const altSymbol = altKey ? "a" : "";
  const ctrlSymbol = ctrlKey ? "c" : "";
  const shiftSymbol = shiftKey ? "s" : "";
  const keyPostfix = `${altSymbol}${ctrlSymbol}${shiftSymbol}`;
  return `${code}_${keyPostfix}`;
};

const isTextInputActive = () => {
  const tag = document.activeElement?.tagName;
  if (tag === "TEXTAREA") {
    return true;
  } else if (tag === "INPUT") {
    const input = document.activeElement as HTMLInputElement;
    if (TEXT_INPUTS_TYPES.includes(input.type)) {
      return true;
    }
  }
};

export const useHotKeys = (
  hotkeyMap: HotkeyMapType,
  deps: any[],
  ref?: React.RefObject<HTMLElement>
) => {
  const callback = useCallback(
    (event: KeyboardEvent, { blockInputs = true } = {}) => {
      // console.log(event.code, document.activeElement?.tagName);
      const value = hotkeyMap[getMapKey(event)];
      if (!value) return;
      event.stopPropagation();
      if (blockInputs) {
        if (isTextInputActive()) {
          return;
        } else event.preventDefault();
      }
      const func =
        value && typeof value === "object"
          ? () => value.func(event, value.options)
          : () => value(event);
      func();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, document.activeElement, hotkeyMap]
  );
  useEffect(() => {
    const element = ref?.current ? ref.current : window;
    element.addEventListener(
      "keydown",
      callback as EventListenerOrEventListenerObject
    );
    return () =>
      element.removeEventListener(
        "keydown",
        callback as EventListenerOrEventListenerObject
      );
  }, [callback, ref]);
};

export const useClickOutside = <T extends HTMLElement, T2 extends HTMLElement>(
  handler: (event: PointerEvent) => void,
  ref: RefObject<T>,
  ref2?: RefObject<T2>
) => {
  const callback = useCallback(
    (event: PointerEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      if (
        ref2 &&
        (!ref2?.current || ref2?.current.contains(event.target as Node))
      )
        return;
      event.stopPropagation();
      handler(event);
    },
    [handler, ref, ref2]
  );
  useEffect(() => {
    window.addEventListener("pointerdown", callback);
    return () => window.removeEventListener("pointerdown", callback);
  }, [callback, ref2]);
};

export const useResize = (func: () => any, deps: any[] = []) => {
  useEffect(() => {
    window.addEventListener("resize", func);
    return () => window.removeEventListener("resize", func);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [func, ...deps]);
};
