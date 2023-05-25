import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";
import styles from "../ControlNetForm.module.scss";

type OwnProps = {
  title: string;
  id: string;
  min: number;
  value: number;
};
type DispatchProps = typeof MDTP;
type CnInputProps = OwnProps & DispatchProps;

const ControlNetNumberInput: React.FC<CnInputProps> = ({
  title,
  id,
  min,
  value,
  setCnConfig,
}) => {
  const onChange = useCallback(
    (event) => {
      setCnConfig({
        [id]: +event.target.value,
      });
    },
    [setCnConfig, id]
  );
  return (
    <label>
      <span className={styles.title}>{title}</span>
      <input
        className={styles.numberInput}
        type="number"
        min={min}
        value={value}
        onChange={onChange}
      ></input>
    </label>
  );
};

const MDTP = { setCnConfig };

export default connect(null, MDTP)(ControlNetNumberInput);
