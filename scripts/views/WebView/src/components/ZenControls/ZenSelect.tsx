import React, { useState, useRef } from "react";
import { useClickOutside } from "hooks";
import styles from "./ZenControls.module.scss";

type SelectProps = {
  disabled?: boolean;
  title: string;
  text: string;
  options: string[];
  onPointerDown: (value: string) => void;
};

const ZenSelect = ({
  disabled,
  title,
  text,
  options,
  onPointerDown,
}: SelectProps) => {
  const [isHidden, setIsHidden] = useState(true);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(() => setIsHidden(true), selectRef, buttonRef);

  return (
    <div className={styles.selectBase}>
      <button
        className={styles.indicator}
        ref={buttonRef}
        disabled={disabled}
        onPointerDown={() => setIsHidden((value) => !value)}
        title={title}
      >
        {text}
      </button>
      {!isHidden && (
        <div className={styles.select} ref={selectRef}>
          {options.map((option) => (
            <button
              key={option}
              className={styles.indicator}
              onPointerDown={() => {
                setIsHidden(true);
                onPointerDown(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZenSelect;
