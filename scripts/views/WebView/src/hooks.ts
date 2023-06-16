import { useEffect, useCallback } from "react";

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
  if (document.activeElement?.tagName === "TEXTAREA") return true;
  if (document.activeElement?.tagName === "INPUT") {
    const input = document.activeElement as HTMLInputElement;
    if (["number", "text"].includes(input.type)) return true;
    return false;
  }
  return false;
};

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
