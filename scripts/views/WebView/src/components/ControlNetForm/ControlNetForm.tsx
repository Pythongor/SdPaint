import React, { useEffect } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setCnConfig } from "store/actions";
import { getModels, getModules } from "../../api";
import ControlNetNumberInput from "./components/ControlNetNumberInput";
import ControlNetSelect from "./components/ControlNetSelect";
import { getConfig } from "../../storage";
import cn from "classnames";
import styles from "./ControlNetForm.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type CnFormProps = StateProps & DispatchProps;

export const ControlNetForm: React.FC<CnFormProps> = ({
  setCnConfig,
  cnConfig,
}) => {
  useEffect(() => {
    const {
      seed,
      steps,
      batch_size,
      cfg_scale,
      prompt,
      negative_prompt,
      controlnet_units: [{ module, model }],
    } = getConfig();
    setCnConfig({
      seed,
      steps,
      cfg_scale,
      negative_prompt,
      prompt,
      module,
      model,
      batch_size,
    });
  }, []);

  return (
    <div className={styles.base}>
      <label className={cn(styles.group, styles.group__prompt)}>
        <span className={styles.title}>Enter your prompt</span>
        <textarea
          className={styles.textarea}
          value={cnConfig.prompt}
          onChange={(event) => setCnConfig({ prompt: event.target.value })}
        ></textarea>
      </label>
      <label className={cn(styles.group, styles.group__prompt)}>
        <span className={styles.title}>Enter negative prompt</span>
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
          title="Seed"
          id="seed"
          min={-1}
          value={cnConfig.seed}
        />
        <ControlNetNumberInput
          title="Steps"
          id="steps"
          min={1}
          value={cnConfig.steps}
        />
        <ControlNetNumberInput
          title="CFG Scale"
          id="cfg_scale"
          min={1}
          value={cnConfig.cfg_scale}
        />
        <ControlNetNumberInput
          title="Batch size"
          id="batch_size"
          min={1}
          value={cnConfig.batch_size}
        />
        <ControlNetSelect
          title="Module"
          listName="modules"
          unitName="module"
          getFunc={getModules}
        />
        <ControlNetSelect
          title="Model"
          listName="models"
          unitName="model"
          getFunc={getModels}
        />
      </div>
    </div>
  );
};

const MSTP = ({ cnConfig }: StateType) => ({ cnConfig });

const MDTP = { setCnConfig };

export default connect(MSTP, MDTP)(ControlNetForm);
