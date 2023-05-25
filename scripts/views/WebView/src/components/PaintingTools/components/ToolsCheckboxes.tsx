import React from "react";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

export const ToolsCheckboxes = () => {
  return (
    <div>
      <div className={styles.group}>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            defaultChecked
          ></input>
          <span>Powerful GPU mode</span>
        </label>
      </div>
      <div className={styles.group}>
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            defaultChecked
          ></input>
          <span>Sync with JSON</span>
        </label>
      </div>
    </div>
  );
};
