import React from "react";
import { AudioSignalType, StateType } from "store/types";
import { connect } from "react-redux";
import {
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioSignalType,
  setResultImagesCount,
} from "store/actions";
import cn from "classnames";
import styles from "./ModalWrapper.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const RESULT_IMAGES_GRID_TYPES = [2, 4, 6, 9, 12, 16];

const Settings: React.FC<ImageViewerProps> = ({
  instantGenerationMode,
  audioSignalType,
  isAudioEnabled,
  imagesCount,
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioSignalType,
  setResultImagesCount,
}) => {
  return (
    <div
      className={styles.settings}
      onClick={(ev) => {
        ev.stopPropagation();
      }}
    >
      <div className={styles.title}>Settings</div>
      <div className={styles.group}>
        <label
          className={styles.label}
          title="Switch instant mode (requests image redraw just when you stroke)"
        >
          <span className={styles.span}>Instant mode</span>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={instantGenerationMode}
            onChange={() => setInstantGenerationMode(!instantGenerationMode)}
          ></input>
        </label>
        <label
          className={styles.label}
          title="Change images count in multiple mode"
        >
          <span className={styles.span}>Multiple images count</span>
          <select
            className={styles.select}
            value={imagesCount}
            onChange={(event) => setResultImagesCount(+event?.target.value)}
          >
            {RESULT_IMAGES_GRID_TYPES.map((count) => (
              <option value={count} key={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.group}>
        <label
          className={styles.label}
          title="Switch audio signal after image generation is completed"
        >
          <span className={styles.span}>Audio signal</span>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isAudioEnabled}
            onChange={() => setAudioEnabled(!isAudioEnabled)}
          ></input>
        </label>
        <label className={styles.label} title="Change audio signal theme">
          <span className={styles.span}>Audio theme</span>
          <select
            className={styles.select}
            value={audioSignalType}
            onChange={(event) =>
              setAudioSignalType(event?.target.value as AudioSignalType)
            }
          >
            <option value="bounce">bounce</option>
            <option value="epic">epic</option>
            <option value="ringtone">ringtone</option>
          </select>
        </label>
      </div>
    </div>
  );
};

const MSTP = ({
  instantGenerationMode,
  audio: { isEnabled, signalType },
  result: { imagesCount },
}: StateType) => ({
  instantGenerationMode,
  isAudioEnabled: isEnabled,
  audioSignalType: signalType,
  imagesCount,
});

const MDTP = {
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioSignalType,
  setResultImagesCount,
};

export default connect(MSTP, MDTP)(Settings);
