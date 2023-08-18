import React, { useState } from "react";
import ZenSelect from "./ZenSelect";
import { StateType } from "store/types";
import { BrushType } from "store/brush/types";
import { connect } from "react-redux";

import { setInstantGenerationMode, setZenMode } from "store/actions";
import { setAudioEnabled } from "store/audio/actions";
import {
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
} from "store/brush/actions";
import { setMultipleImagesMode } from "store/result/actions";

import { getErasingState } from "store/selectors";
import cn from "classnames";
import styles from "./ZenControls.module.scss";
import { Arrow } from "components/widgets";

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
  isMultipleModeOn,
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
  setMultipleImagesMode,
}) => {
  const [isHidden, setHidden] = useState(false);

  if (!isZenModeOn) return null;

  const isPrimitiveShape = ["ellipse", "rectangle"].includes(brushType);
  const brushWidths = Array.from(Array(11).keys())
    .slice(1)
    .map((num) => String(num));

  return (
    <div className={cn(styles.base, isHidden && styles.base__hidden)}>
      <Arrow
        onPointerDown={() => setHidden((value) => !value)}
        customClass={styles.arrow}
        title={isHidden ? "Show control panel" : "Hide control panel"}
        isOn={!isHidden}
        position="top"
      />
      <div className={styles.group}>
        <ZenSelect
          text={brushType[0].toUpperCase()}
          options={["pencil", "line", "ellipse", "rectangle"]}
          onPointerDown={(value) => setBrushType(value as BrushType)}
          title="Set brush shape mode"
        />
        <ZenSelect
          disabled={isPrimitiveShape && withBrushFill}
          text={`W: ${isPrimitiveShape && withBrushFill ? 1 : brushWidth}`}
          options={brushWidths}
          onPointerDown={(value) => setBrushWidth(+value)}
          title="Set brush width"
        />
        <button
          className={cn(
            styles.indicator,
            withBrushFill ? styles.indicator__fill : styles.indicator__inactive
          )}
          disabled={!isPrimitiveShape || isErasing}
          onPointerDown={() => setBrushFilling("switch")}
          title="Switch brush fill mode (only for rectangle and ellipce)"
        >
          F
        </button>
        <button
          className={cn(
            styles.indicator,
            isErasing ? styles.indicator__eraser : styles.indicator__inactive
          )}
          onPointerDown={() => setErasingBySwitch("switch")}
          title="Switch brush eraser mode"
        >
          E
        </button>
      </div>
      <div className={styles.group}>
        <button
          className={cn(
            styles.indicator,
            !isMultipleModeOn && styles.indicator__inactive
          )}
          onPointerDown={() => setMultipleImagesMode(!isMultipleModeOn)}
          title="Switch audio signal after image generation is completed"
        >
          M
        </button>
        <button
          className={cn(
            styles.indicator,
            !!audioEnabled && styles.indicator__eraser
          )}
          onPointerDown={() => setAudioEnabled("switch")}
          title="Switch audio signal after image generation is completed"
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
          onPointerDown={() => setInstantGenerationMode("switch")}
          title="Switch instant mode (requests image redraw just when you stroke)"
        >
          I
        </button>
        <button
          className={cn(styles.indicator, styles.indicator__zen)}
          onPointerDown={() => setZenMode(false)}
          title="Exit simplified interface mode"
        >
          Z
        </button>
      </div>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  brushType: state.brush.brushType,
  brushWidth: state.brush.width,
  withBrushFill: state.brush.withFill,
  isZenModeOn: state.root.isZenModeOn,
  isErasing: getErasingState(state),
  instantGenerationMode: state.root.instantGenerationMode,
  audioEnabled: state.audio.isEnabled,
  isMultipleModeOn: state.result.isMultipleImagesModeOn,
});

const MDTP = {
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
  setMultipleImagesMode,
};

export default connect(MSTP, MDTP)(ZenIndicator);
