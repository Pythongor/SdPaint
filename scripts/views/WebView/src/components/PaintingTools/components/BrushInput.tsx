import React from "react";
import { connect } from "react-redux";
import { StateType, BrushType } from "store/types";
import {
  setBrushWidth,
  setIsErasing,
  setBrushType,
  setBrushFilling,
} from "store/actions";
import { getRealBrushWidth } from "store/selectors";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type BrushInputProps = StateProps & DispatchProps;

const BrushInput: React.FC<BrushInputProps> = ({
  isErasing,
  brushWidth,
  brushType,
  withBrushFill,
  setBrushWidth,
  setIsErasing,
  setBrushType,
  setBrushFilling,
}) => {
  const isPrimitiveShape = ["ellipse", "rectangle"].includes(brushType);
  const sampleWidth = isPrimitiveShape && withBrushFill ? 10 : brushWidth;
  const onSliderInput = (event: React.FormEvent<HTMLInputElement>) =>
    setBrushWidth(+event.currentTarget.value);

  const onEraserInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setIsErasing(true);
    } else {
      setIsErasing(false);
    }
  };

  const onFillInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setBrushFilling(true);
    } else {
      setBrushFilling(false);
    }
  };

  return (
    <div className={styles.group}>
      <label>
        <span className={styles.title}>Customize brush</span>
        <input
          disabled={isPrimitiveShape && withBrushFill}
          className={styles.slider}
          type="range"
          min="1"
          max="10"
          defaultValue="2"
          onInput={onSliderInput}
        ></input>
      </label>
      <div className={styles.flexGroup}>
        <select
          className={styles.select}
          value={brushType}
          onChange={(event) =>
            setBrushType(event.currentTarget.value as BrushType)
          }
        >
          <option value="pencil">Pencil</option>
          <option value="line">Line</option>
          <option value="rectangle">Rectangle</option>
          <option value="ellipse">Ellipse</option>
        </select>
      </div>
      <div className={styles.flexGroup}>
        <div>
          <label className={styles.label}>
            <input
              className={styles.checkbox}
              type="checkbox"
              onInput={onEraserInput}
            ></input>
            <span>Eraser</span>
          </label>
          <label className={styles.label}>
            <input
              defaultChecked={withBrushFill}
              disabled={!isPrimitiveShape}
              className={styles.checkbox}
              type="checkbox"
              onInput={onFillInput}
            ></input>
            <span>Fill</span>
          </label>
        </div>
        <div
          className={cn(
            styles.brush_surrounding,
            isErasing && styles.brush_surrounding__erasing
          )}
        >
          <div
            className={cn(
              styles.brush_sample,
              isErasing && styles.brush_sample__erasing,
              brushType === "rectangle" && styles.brush_sample__rectangle
            )}
            style={{ width: `${sampleWidth}px`, height: `${sampleWidth}px` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const MSTP = (state: StateType) => {
  return {
    isErasing: state.isErasing,
    brushType: state.brushType,
    withBrushFill: state.withBrushFill,
    brushWidth: getRealBrushWidth(state),
  };
};

const MDTP = { setBrushWidth, setIsErasing, setBrushType, setBrushFilling };

export default connect(MSTP, MDTP)(BrushInput);
