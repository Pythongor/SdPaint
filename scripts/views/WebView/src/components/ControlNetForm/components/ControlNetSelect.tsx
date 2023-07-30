import React, { useEffect, useCallback } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setCnConfig, addPopup } from "store/actions";
import { retryRequest } from "api";
import styles from "../ControlNetForm.module.scss";

type OwnProps = {
  name: string;
  title: string;
  listName: "models" | "modules";
  unitName: "model" | "module";
  getFunc: () => Promise<{ list: string[] } | { error: Error }>;
};
type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type CnSelectProps = OwnProps & StateProps & DispatchProps;

const ControlNetSelect: React.FC<CnSelectProps> = ({
  name,
  title,
  listName,
  unitName,
  cnConfig,
  getFunc,
  setCnConfig,
  addPopup,
}) => {
  useEffect(() => {
    if (!setCnConfig || !listName || !unitName) return;
    retryRequest({
      retries: 10,
      progressFunc: () => false,
      finalFunc: (data) => {
        if ("error" in data) return;
        setCnConfig({ [listName]: data.list });
      },
      fetchFunc: () => getFunc(),
      addPopup,
    });
  }, [listName, setCnConfig, unitName, addPopup, getFunc]);

  const onChange = useCallback(
    (event) => setCnConfig({ [unitName]: event.target.value }),
    [setCnConfig, unitName]
  );

  return (
    <label>
      <span className={styles.title} title={title}>
        {name}
      </span>
      <select
        className={styles.select}
        onChange={onChange}
        value={cnConfig[unitName]}
      >
        {cnConfig[listName] &&
          cnConfig[listName].map((name) => (
            <option key={name} value={name} className={styles.option}>
              {name}
            </option>
          ))}
      </select>
    </label>
  );
};

const MSTP = ({ cnConfig }: StateType) => ({ cnConfig });

const MDTP = { setCnConfig, addPopup };

export default connect(MSTP, MDTP)(ControlNetSelect);
