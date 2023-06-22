import { ConfigType } from "storage";

export const extractDataFromConfig = ({
  seed,
  steps,
  batch_size,
  cfg_scale,
  prompt,
  negative_prompt,
  controlnet_units: [{ module, model }],
}: ConfigType) => ({
  seed,
  steps,
  cfg_scale,
  negative_prompt,
  prompt,
  module,
  model,
  batch_size,
});
