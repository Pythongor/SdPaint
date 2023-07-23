import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getCanvasImage } from "store/selectors";
import {
  setResultImages,
  setCnProgress,
  setAudioReady,
  setCnConfig,
  setMultipleImagesMode,
  setResultInfo,
} from "store/actions";
import { generate, handleAudioSignal } from "../generate";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type GenerateGroupProps = StateProps & DispatchProps;

const GenerateGroup: React.FC<GenerateGroupProps> = ({
  paintImage,
  isMultipleModeOn,
  audio,
  setResultImages,
  setCnProgress,
  setAudioReady,
  setMultipleImagesMode,
  setResultInfo,
}) => {
  const audioFunc = useCallback(
    () => handleAudioSignal(audio, setAudioReady),
    [audio]
  );

  const onClick = useCallback(() => {
    generate(
      paintImage,
      setResultImages,
      setCnProgress,
      setResultInfo,
      audioFunc
    );
  }, [paintImage, setResultImages, setCnProgress, setResultInfo, audio]);

  return (
    <div className={styles.group}>
      <label
        className={styles.label}
        title="In multiple mode app generates few images instead of just one"
      >
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isMultipleModeOn}
          onChange={() => {
            setMultipleImagesMode(!isMultipleModeOn);
          }}
        ></input>
        Multiple mode
      </label>
      <button
        className={cn(styles.button, styles.button__generate)}
        onClick={onClick}
        title="Start image generation using your sketch and form data"
      >
        Generate
      </button>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getCanvasImage(state),
  imagesCount: state.cnConfig.batch_size,
  audio: state.audio,
  isMultipleModeOn: state.result.isMultipleImagesModeOn,
});

const MDTP = {
  setResultImages,
  setCnProgress,
  setAudioReady,
  setCnConfig,
  setMultipleImagesMode,
  setResultInfo,
};

export default connect(MSTP, MDTP)(GenerateGroup);
