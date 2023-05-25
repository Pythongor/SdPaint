import React from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setBrushWidth, setIsErasing } from "store/actions";
import { getRealBrushWidth } from "store/selectors";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type BrushInputProps = StateProps & DispatchProps;

const BrushInput: React.FC<BrushInputProps> = ({
  isErasing,
  setBrushWidth,
  setIsErasing,
  brushWidth,
}) => {
  const onSliderInput = (event: React.FormEvent<HTMLInputElement>) =>
    setBrushWidth(+event.currentTarget.value);

  const onEraserInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setIsErasing(true);
    } else {
      setIsErasing(false);
    }
  };

  return (
    <div className={styles.group}>
      <label>
        <span className={styles.title}>Customize brush</span>
        <input
          className={styles.slider}
          type="range"
          min="1"
          max="10"
          defaultValue="2"
          onInput={onSliderInput}
        ></input>
      </label>
      <div className={styles.brush}>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            onInput={onEraserInput}
          ></input>
          <span>Eraser</span>
        </label>
        <div
          className={cn(
            styles.brush_surrounding,
            isErasing && styles.brush_surrounding__erasing
          )}
        >
          <div
            className={cn(
              styles.brush_sample,
              isErasing && styles.brush_sample__erasing
            )}
            style={{ width: `${brushWidth}px`, height: `${brushWidth}px` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const MSTP = (state: StateType) => {
  return {
    isErasing: state.isErasing,
    brushWidth: getRealBrushWidth(state),
  };
};

const MDTP = { setBrushWidth, setIsErasing };

export default connect(MSTP, MDTP)(BrushInput);
