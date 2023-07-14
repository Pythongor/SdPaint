import { useEffect, useCallback, RefObject } from "react";

const inputTags = ["TEXTAREA", "INPUT", "BUTTON"];

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

const isTextInputActive = () =>
  inputTags.includes(document.activeElement?.tagName || "");

export const useHotKeys = (hotkeyMap: HotkeyMapType, deps: any[]) => {
  const callback = useCallback(
    (event: KeyboardEvent, { blockInputs = true } = {}) => {
      // console.log(event.code, document.activeElement?.tagName);
      const value = hotkeyMap[getMapKey(event)];
      if (!value) return;
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
    [...deps, document.activeElement]
  );
  useEffect(() => {
    window.addEventListener("keydown", callback);
    return () => window.removeEventListener("keydown", callback);
  });
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
    [ref, ref2, ref2?.current]
  );
  useEffect(() => {
    window.addEventListener("pointerdown", callback);
    return () => window.removeEventListener("pointerdown", callback);
  }, [ref.current, ref2, ref2?.current]);
};

export const useCloseOnEscape = () => {};
