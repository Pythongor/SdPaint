import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setCnConfig, setScrollTop, addPopup } from "store/actions";
import { getModels, getModules } from "../../api";
import { Arrow } from "components/widgets";
import ControlNetNumberInput from "./components/ControlNetNumberInput";
import ControlNetSelect from "./components/ControlNetSelect";
import cn from "classnames";
import styles from "./ControlNetForm.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type CnFormProps = StateProps & DispatchProps;

export const ControlNetForm: React.FC<CnFormProps> = ({
  cnConfig,
  isZenModeOn,
  setCnConfig,
  setScrollTop,
  addPopup,
}) => {
  const [isHidden, setHidden] = useState(isZenModeOn);

  const memoizedGetModules = useCallback(
    () => getModules(addPopup),
    [addPopup]
  );

  const memoizedGetModels = useCallback(() => getModels(addPopup), [addPopup]);

  useEffect(() => {
    if (isZenModeOn) {
      setHidden(true);
    } else setHidden(false);
  }, [isZenModeOn]);

  return (
    <div
      className={cn(
        styles.base,
        isZenModeOn && styles.base__zen,
        isHidden && styles.base__hidden
      )}
      onTransitionEnd={() => setScrollTop(0)}
    >
      <label className={cn(styles.group, styles.group__prompt)}>
        <span className={styles.title} title="Describe the desired result">
          Prompt
        </span>
        <textarea
          className={styles.textarea}
          value={cnConfig.prompt}
          onChange={(event) => setCnConfig({ prompt: event.target.value })}
        ></textarea>
      </label>
      <label className={cn(styles.group, styles.group__prompt)}>
        <span className={styles.title} title="Describe the undesired result">
          Negative prompt
        </span>
        <textarea
          className={styles.textarea}
          value={cnConfig.negative_prompt}
          onChange={(event) =>
            setCnConfig({ negative_prompt: event.target.value })
          }
        ></textarea>
      </label>
      <div className={cn(styles.group, styles.group__miscellaneous)}>
        <ControlNetNumberInput
          name="Seed"
          title="Having parameters, seed and your sketch unchanged means having the same result"
          id="seed"
          min={-1}
          value={cnConfig.seed}
        />
        <ControlNetNumberInput
          name="Steps"
          title="The higher the value, the better the result, but the more waiting time"
          id="steps"
          min={1}
          value={cnConfig.steps}
        />
        <ControlNetNumberInput
          name="CFG Scale"
          title="The higher the value, the more accurate may be the result"
          id="cfg_scale"
          min={1}
          value={cnConfig.cfg_scale}
        />
        <ControlNetSelect
          name="Module"
          title="ControlNet module"
          listName="modules"
          unitName="module"
          getFunc={memoizedGetModules}
        />
        <ControlNetSelect
          name="Model"
          title="ControlNet model"
          listName="models"
          unitName="model"
          getFunc={memoizedGetModels}
        />
      </div>
      <Arrow
        onPointerDown={() => setHidden((value) => !value)}
        title={isHidden ? "Show ControlNet form" : "Hide ControlNet form"}
        isOn={!isHidden}
        isHidden={!isZenModeOn}
      />
    </div>
  );
};

const MSTP = ({ cnConfig, isZenModeOn }: StateType) => ({
  cnConfig,
  isZenModeOn,
});

const MDTP = { setCnConfig, setScrollTop, addPopup };

export default connect(MSTP, MDTP)(ControlNetForm);
