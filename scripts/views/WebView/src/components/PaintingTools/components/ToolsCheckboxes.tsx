import React from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setZenMode } from "store/actions";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ToolsCheckboxesProps = StateProps & DispatchProps;

export const ToolsCheckboxes: React.FC<ToolsCheckboxesProps> = ({
  isZenModeOn,
  setZenMode,
}) => {
  return (
    <div>
      <div className={cn(styles.group, styles.group__checkbox)}>
        <label className={styles.label} title="Switch to simplified view">
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

const MSTP = ({ root: { isZenModeOn } }: StateType) => ({ isZenModeOn });

const MDTP = { setZenMode };

export default connect(MSTP, MDTP)(ToolsCheckboxes);
