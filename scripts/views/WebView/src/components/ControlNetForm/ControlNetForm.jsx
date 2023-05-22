import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setCnConfig } from "store/actions";
import { getModels, getModules } from "../../api";
import ControlNetInput from "./components/ControlNetInput";
import ControlNetSelect from "./components/ControlNetSelect";
import { getConfig } from "../../storage";

export const ControlNetForm = ({ setCnConfig, cnConfig }) => {
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
    <div className="cn-configuration">
      <label className="cn-configuration_group cn-configuration_group__prompt">
        <span className="cn-configuration_title">Enter your prompt</span>
        <textarea
          className="textarea"
          id="prompt"
          name=""
          value={cnConfig.prompt}
          onChange={(event) => setCnConfig({ prompt: event.target.value })}
        ></textarea>
      </label>
      <label className="cn-configuration_group cn-configuration_group__prompt">
        <span className="cn-configuration_title">Enter negative prompt</span>
        <textarea
          className="textarea"
          id="negativePrompt"
          name=""
          value={cnConfig.negative_prompt}
          onChange={(event) =>
            setCnConfig({ negative_prompt: event.target.value })
          }
        ></textarea>
      </label>
      <div className="cn-configuration_group cn-configuration_group__misc">
        <ControlNetInput
          title="Seed"
          inputType="number"
          id="seed"
          min="-1"
          value={cnConfig.seed}
        />
        <ControlNetInput
          title="Steps"
          inputType="number"
          id="steps"
          min="1"
          value={cnConfig.steps}
        />
        <ControlNetInput
          title="CFG Scale"
          inputType="number"
          id="cfg_scale"
          min="1"
          value={cnConfig.cfg_scale}
        />
        <ControlNetInput
          title="Batch size"
          inputType="number"
          id="batch_size"
          min="1"
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

const MSTP = ({ cnConfig }) => ({ cnConfig });

const MDTP = { setCnConfig };

export default connect(MSTP, MDTP)(ControlNetForm);
