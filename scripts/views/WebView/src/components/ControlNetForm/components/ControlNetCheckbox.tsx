import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";
import { StateType } from "store/types";
import styles from "../ControlNetForm.module.scss";

type OwnProps = {
  name: string;
  title: string;
  id: keyof StateType["cnConfig"];
};
type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type CnCheckboxProps = OwnProps & StateProps & DispatchProps;

const ControlNetCheckbox: React.FC<CnCheckboxProps> = ({
  name,
  title,
  id,
  cnConfig,
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
  const checked = cnConfig[id];
  if (typeof checked !== "boolean") return null;
  return (
    <label>
      <span className={styles.title} title={title}>
        {name}
      </span>
      <input
        className={styles.checkbox}
        type="checkbox"
        onChange={onChange}
        checked={checked}
      ></input>
    </label>
  );
};

const MSTP = ({ cnConfig }: StateType) => ({ cnConfig });

const MDTP = { setCnConfig };

export default connect(MSTP, MDTP)(ControlNetCheckbox);
