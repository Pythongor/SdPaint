import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/controlNet/actions";
import styles from "../ControlNetForm.module.scss";

type OwnProps = {
  name: string;
  title: string;
  id: string;
  min: number;
  value: number;
};
type DispatchProps = typeof MDTP;
type CnInputProps = OwnProps & DispatchProps;

const ControlNetNumberInput: React.FC<CnInputProps> = ({
  name,
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
      <span className={styles.title} title={title}>
        {name}
      </span>
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
