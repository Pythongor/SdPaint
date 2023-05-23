import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";

type OwnProps = {
  title: string;
  id: string;
  min: number;
  value: number;
}
type DispatchProps = typeof MDTP;
type CnInputProps = OwnProps & DispatchProps

const ControlNetNumberInput: React.FC<CnInputProps> = ({ title, id, min, value, setCnConfig }) => {
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
      <span className="cn-configuration_title">{title}</span>
      <input
        className="number_input"
        type="number"
        min={min}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
      ></input>
    </label>
  );
};

const MDTP = { setCnConfig };

export default connect(null, MDTP)(ControlNetNumberInput);
