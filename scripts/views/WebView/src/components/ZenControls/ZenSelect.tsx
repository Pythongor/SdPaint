import React, { useState, useRef } from "react";
import { useClickOutside } from "hooks";
import styles from "./ZenControls.module.scss";

type SelectProps = {
  disabled?: boolean;
  text: string;
  options: string[];
  onClick: (value: string) => void;
};

export default ({ disabled, text, options, onClick }: SelectProps) => {
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
        onClick={() => setIsHidden((value) => !value)}
      >
        {text}
      </button>
      {!isHidden && (
        <div className={styles.select} ref={selectRef}>
          {options.map((option) => (
            <button
              key={option}
              className={styles.indicator}
              onClick={() => {
                setIsHidden(true);
                onClick(option);
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
