import React, { useState } from "react";
import ZenSelect from "./ZenSelect";
import { BrushType, StateType } from "store/types";
import { connect } from "react-redux";
import {
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
} from "store/actions";
import { getErasingState } from "store/selectors";
import cn from "classnames";
import styles from "./ZenControls.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ZenIndicator: React.FC<ResultCanvasProps> = ({
  brushType,
  brushWidth,
  withBrushFill,
  isZenModeOn,
  isErasing,
  instantGenerationMode,
  audioEnabled,
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
}) => {
  const [isHide, setIsHide] = useState(false);

  if (!isZenModeOn) return null;

  const isPrimitiveShape = ["ellipse", "rectangle"].includes(brushType);
  const brushWidths = Array.from(Array(11).keys())
    .slice(1)
    .map((num) => String(num));

  return (
    <div className={cn(styles.base, isHide && styles.base__hidden)}>
      <div className={styles.group}>
        <ZenSelect
          text={brushType[0].toUpperCase()}
          options={["pencil", "line", "ellipse", "rectangle"]}
          onClick={(value) => setBrushType(value as BrushType)}
        />
        <ZenSelect
          disabled={isPrimitiveShape && withBrushFill}
          text={`W: ${isPrimitiveShape && withBrushFill ? 1 : brushWidth}`}
          options={brushWidths}
          onClick={(value) => setBrushWidth(+value)}
        />
        <button
          className={cn(
            styles.indicator,
            withBrushFill ? styles.indicator__fill : styles.indicator__inactive
          )}
          disabled={!isPrimitiveShape || isErasing}
          onClick={() => setBrushFilling("switch")}
        >
          F
        </button>
        <button
          className={cn(
            styles.indicator,
            isErasing ? styles.indicator__eraser : styles.indicator__inactive
          )}
          onClick={() => setErasingBySwitch("switch")}
        >
          E
        </button>
      </div>
      <div className={styles.group}>
        <button
          className={cn(
            styles.indicator,
            !!audioEnabled && styles.indicator__eraser
          )}
          onClick={() => setAudioEnabled("switch")}
        >
          A
        </button>
        <button
          className={cn(
            styles.indicator,
            instantGenerationMode
              ? styles.indicator__instant
              : styles.indicator__inactive
          )}
          onClick={() => setInstantGenerationMode("switch")}
        >
          I
        </button>
        <button
          className={cn(styles.indicator, styles.indicator__zen)}
          onClick={() => setZenMode(false)}
        >
          Z
        </button>
      </div>
      <div
        className={cn(styles.arrow, isHide && styles.arrow__hidden)}
        onClick={() => setIsHide((value) => !value)}
      ></div>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  brushType: state.brushConfig.brushType,
  brushWidth: state.brushConfig.width,
  withBrushFill: state.brushConfig.withFill,
  isZenModeOn: state.isZenModeOn,
  isErasing: getErasingState(state),
  instantGenerationMode: state.instantGenerationMode,
  audioEnabled: state.audio.isEnabled,
});

const MDTP = {
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
};

export default connect(MSTP, MDTP)(ZenIndicator);
