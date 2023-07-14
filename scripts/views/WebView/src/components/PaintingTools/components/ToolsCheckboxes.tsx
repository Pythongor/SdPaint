import React from "react";
import { connect } from "react-redux";
import { AudioSignalType, StateType } from "store/types";
import {
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
  setAudioSignalType,
} from "store/actions";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ToolsCheckboxesProps = StateProps & DispatchProps;

export const ToolsCheckboxes: React.FC<ToolsCheckboxesProps> = ({
  instantGenerationMode,
  isZenModeOn,
  isAudioEnabled,
  audioSignalType,
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
  setAudioSignalType,
}) => {
  return (
    <div>
      <div className={cn(styles.group, styles.group__checkbox)}>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isZenModeOn}
            onChange={(event) => {
              event.currentTarget.checked = !isZenModeOn;
              setZenMode(!isZenModeOn);
            }}
          ></input>
          <span>Zen mode</span>
        </label>
      </div>
    </div>
  );
};

const MSTP = ({
  instantGenerationMode,
  isZenModeOn,
  audio: { isEnabled, signalType },
}: StateType) => ({
  instantGenerationMode,
  isZenModeOn,
  isAudioEnabled: isEnabled,
  audioSignalType: signalType,
});

const MDTP = {
  setInstantGenerationMode,
  setZenMode,
  setAudioEnabled,
  setAudioSignalType,
};

export default connect(MSTP, MDTP)(ToolsCheckboxes);
