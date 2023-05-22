import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";

const CnInput = ({ title, inputType, id, min, value, setCnConfig }) => {
  const onChange = useCallback(
    (event) => {
      setCnConfig({
        [id]: inputType === "number" ? +event.target.value : event.target.value,
      });
    },
    [setCnConfig, id]
  );
  return (
    <label>
      <span className="cn-configuration_title">{title}</span>
      <input
        className={`${inputType}_input`}
        type={inputType}
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

export default connect(null, MDTP)(CnInput);
