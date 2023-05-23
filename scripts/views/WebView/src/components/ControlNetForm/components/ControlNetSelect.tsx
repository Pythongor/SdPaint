import React, { useEffect, useCallback } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";

type OwnProps = {
  title: string;
  listName: 'models' | 'modules';
  unitName: 'model' | 'module';
  getFunc: () => Promise<{list: string[]}>
}
type StateProps = ReturnType<typeof MSTP>
type DispatchProps = typeof MDTP
type CnSelectProps = OwnProps & StateProps & DispatchProps

const ControlNetSelect: React.FC<CnSelectProps> = ({
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

const MSTP = ({ cnConfig }: StateType) => ({ cnConfig });

const MDTP = { setCnConfig };

export default connect(MSTP, MDTP)(ControlNetSelect);
