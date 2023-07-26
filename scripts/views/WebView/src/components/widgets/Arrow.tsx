import React from "react";
import cn from "classnames";
import styles from "./widgets.module.scss";

type ArrowProps = {
  onPointerDown: React.PointerEventHandler<HTMLDivElement>;
  title?: string;
  isHidden?: boolean;
  isOn: boolean;
  position?: "left" | "top" | "right" | "bottom";
  customClass?: string;
};

const Arrow: React.FC<ArrowProps> = ({
  title = "",
  isHidden = false,
  isOn,
  position = "bottom",
  customClass = "",
  onPointerDown,
}) => {
  return (
    <div
      className={cn(
        styles.arrow,
        customClass,
        isHidden && styles.arrow__hidden,
        !isOn && styles.arrow__off,
        styles[`arrow__${position}`]
      )}
      onPointerDown={onPointerDown}
      title={title}
    >
      <div className={styles.arrow_symbol}>{">"}</div>
    </div>
  );
};

export default Arrow;
