import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";

const ControlNetSelect = ({
  title,
  listName,
  unitName,
  getFunc,
  cnConfig,
  setCnConfig,
}) => {
  useEffect(() => {
    if (!setCnConfig || !listName || !unitName) return;
    getFunc().then((data) => setCnConfig({ [listName]: data.list }));
  }, [listName, setCnConfig, unitName]);

  const onChange = useCallback(
    (event) => setCnConfig({ [unitName]: event.target.value }),
    [setCnConfig, unitName]
  );

  return (
    <label>
      <span className="cn-configuration_title">{title}</span>
      <select
        className="select_input"
        name={unitName}
        id={unitName}
        onChange={onChange}
      >
        {cnConfig[listName] &&
          cnConfig[listName].map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
      </select>
    </label>
  );
};

const MSTP = ({ cnConfig }) => ({ cnConfig });

const MDTP = { setCnConfig };

export default connect(MSTP, MDTP)(ControlNetSelect);
