import React from "react";
import { connect } from "react-redux";
import { StateType, BrushType } from "store/types";
import {
  setBrushWidth,
  setErasingBySwitch,
  setBrushType,
  setBrushFilling,
} from "store/actions";
import { getErasingState, getRealBrushWidth } from "store/selectors";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type BrushInputProps = StateProps & DispatchProps;

const BrushInput: React.FC<BrushInputProps> = ({
  isErasing,
  brushWidth,
  realBrushWidth,
  brushType,
  withBrushFill,
  setBrushWidth,
  setErasingBySwitch,
  setBrushType,
  setBrushFilling,
}) => {
  const isPrimitiveShape = ["ellipse", "rectangle"].includes(brushType);
  const baseSampleWidth =
    isPrimitiveShape && withBrushFill ? 10 : realBrushWidth;
  const sampleWidth = isErasing ? baseSampleWidth * 2 : baseSampleWidth;
  const fixedBrushWidth = sampleWidth === 50 ? 51 : sampleWidth;
  const onSliderInput = (event: React.FormEvent<HTMLInputElement>) =>
    setBrushWidth(+event.currentTarget.value);

  const onEraserInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setErasingBySwitch(true);
    } else {
      setErasingBySwitch(false);
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
          value={isPrimitiveShape && withBrushFill ? 1 : brushWidth}
          onChange={onSliderInput}
          title="Set brush width"
        ></input>
      </label>
      <div className={styles.flexGroup}>
        <select
          className={styles.select}
          value={brushType}
          onChange={(event) =>
            setBrushType(event.currentTarget.value as BrushType)
          }
          title="Set brush shape mode"
        >
          <option value="pencil">Pencil</option>
          <option value="line">Line</option>
          <option value="rectangle">Rectangle</option>
          <option value="ellipse">Ellipse</option>
        </select>
      </div>
      <div className={styles.flexGroup}>
        <div>
          <label className={styles.label} title="Switch brush eraser mode">
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={isErasing}
              onChange={onEraserInput}
            ></input>
            <span>Eraser</span>
          </label>
          <label
            className={styles.label}
            title="Switch brush fill mode (only for rectangle and ellipce)"
          >
            <input
              disabled={!isPrimitiveShape || isErasing}
              className={styles.checkbox}
              type="checkbox"
              checked={withBrushFill || !isPrimitiveShape || isErasing}
              onChange={onFillInput}
            ></input>
            <span
              className={cn(
                (!isPrimitiveShape || isErasing) && styles.label_span__disabled
              )}
            >
              Fill
            </span>
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
            style={{
              width: `${fixedBrushWidth}px`,
              height: `${fixedBrushWidth}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const MSTP = (state: StateType) => {
  return {
    isErasing: getErasingState(state),
    brushType: state.brushConfig.brushType,
    withBrushFill: state.brushConfig.withFill,
    realBrushWidth: getRealBrushWidth(state),
    brushWidth: state.brushConfig.width,
  };
};

const MDTP = {
  setBrushWidth,
  setErasingBySwitch,
  setBrushType,
  setBrushFilling,
};

export default connect(MSTP, MDTP)(BrushInput);
