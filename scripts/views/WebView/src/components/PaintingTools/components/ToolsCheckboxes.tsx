import React from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setInstantGenerationMode } from "store/actions";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ToolsCheckboxesProps = StateProps & DispatchProps;

export const ToolsCheckboxes: React.FC<ToolsCheckboxesProps> = ({
  instantGenerationMode,
  setInstantGenerationMode,
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

const MSTP = ({ instantGenerationMode }: StateType) => ({
  instantGenerationMode,
});

const MDTP = { setInstantGenerationMode };

export default connect(MSTP, MDTP)(ToolsCheckboxes);
