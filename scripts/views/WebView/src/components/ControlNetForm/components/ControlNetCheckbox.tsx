import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";
import styles from "../ControlNetForm.module.scss";

type OwnProps = {
  name: string;
  title: string;
  id: string;
};
type DispatchProps = typeof MDTP;
type CnCheckboxProps = OwnProps & DispatchProps;

const ControlNetCheckbox: React.FC<CnCheckboxProps> = ({
  name,
  title,
  id,
  setCnConfig,
}) => {
  const onChange = useCallback(
    (event) => {
      setCnConfig({
        [id]: event.target.checked,
      });
    },
    [setCnConfig, id]
  );
  return (
    <label>
      <span className={styles.title} title={title}>
        {name}
      </span>
      <input
        className={styles.checkbox}
        type="checkbox"
        onChange={onChange}
      ></input>
    </label>
  );
};

const MDTP = { setCnConfig };

export default connect(null, MDTP)(ControlNetCheckbox);
