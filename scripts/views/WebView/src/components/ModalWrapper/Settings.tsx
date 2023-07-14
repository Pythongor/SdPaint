import React from "react";
import { AudioSignalType, StateType } from "store/types";
import { connect } from "react-redux";
import {
  setModal,
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioSignalType,
} from "store/actions";
import cn from "classnames";
import styles from "./ModalWrapper.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const Settings: React.FC<ImageViewerProps> = ({
  modal,
  instantGenerationMode,
  audioSignalType,
  isAudioEnabled,
  setModal,
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioSignalType,
}) => {
  return (
    <div
      className={styles.settings}
      onClick={(ev) => {
        ev.stopPropagation();
      }}
    >
      <div className={styles.title}>Settings</div>
      <div className={cn(styles.group, styles.group__audio)}>
        <label className={styles.label}>
          <span className={styles.span}>Instant mode</span>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={instantGenerationMode}
            onChange={(event) => {
              event.currentTarget.checked = !instantGenerationMode;
              setInstantGenerationMode(!instantGenerationMode);
            }}
          ></input>
        </label>
      </div>
      <div className={cn(styles.group, styles.group__audio)}>
        <label className={styles.label}>
          <span className={styles.span}>Audio signal</span>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isAudioEnabled}
            onChange={(event) => {
              event.currentTarget.checked = !isAudioEnabled;
              setAudioEnabled(!isAudioEnabled);
            }}
          ></input>
        </label>

        <label className={styles.label}>
          <span className={styles.span}>Audio theme</span>
          <select
            className={styles.select}
            name=""
            id=""
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
  modal,
  instantGenerationMode,
  audio: { isEnabled, signalType },
}: StateType) => ({
  modal,
  instantGenerationMode,
  isAudioEnabled: isEnabled,
  audioSignalType: signalType,
});

const MDTP = {
  setModal,
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioSignalType,
};

export default connect(MSTP, MDTP)(Settings);
