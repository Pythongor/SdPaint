import React, { useEffect } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setInstantGenerationMode, setZenMode } from "store/actions";
import { getSettings } from "storage";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ToolsCheckboxesProps = StateProps & DispatchProps;

export const ToolsCheckboxes: React.FC<ToolsCheckboxesProps> = ({
  instantGenerationMode,
  isZenModeOn,
  setInstantGenerationMode,
  setZenMode,
}) => {
  return (
    <div>
      <div className={styles.group}>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={instantGenerationMode}
            onChange={(event) => {
              event.currentTarget.checked = !instantGenerationMode;
              setInstantGenerationMode(!instantGenerationMode);
            }}
          ></input>
          <span>Instant mode</span>
        </label>
      </div>
      <div className={styles.group}>
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
      {/* <div className={styles.group}>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            defaultChecked
          ></input>
          <span>Sync with JSON</span>
        </label>
      </div> */}
    </div>
  );
};

const MSTP = ({ instantGenerationMode, isZenModeOn }: StateType) => ({
  instantGenerationMode,
  isZenModeOn,
});

const MDTP = { setInstantGenerationMode, setZenMode };

export default connect(MSTP, MDTP)(ToolsCheckboxes);
