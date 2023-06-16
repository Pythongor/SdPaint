import { StateType } from "./types";
import { getConfig } from "storage";

const brushWidthMap = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50];

export const getRealBrushWidth = ({ brushWidth }: StateType) =>
  brushWidthMap[brushWidth - 1];

export const getPaintImage = ({
  currentPaintImageIndex,
  paintImagesStack,
}: StateType) => {
  return paintImagesStack[currentPaintImageIndex];
};

export const state2config = ({
  cnConfig: {
    seed,
    steps,
    batch_size,
    cfg_scale,
    prompt,
    negative_prompt,
    module,
    model,
  },
}: StateType) => {
  const config = getConfig();
  const firstUnit = config.controlnet_units[0];

  return {
    ...config,
    seed,
    steps,
    batch_size,
    cfg_scale,
    prompt,
    negative_prompt,
    controlnet_units: [{ ...firstUnit, module, model }],
  };
};

export const state2settings = ({ instantGenerationMode }: StateType) => ({
  instantMode: instantGenerationMode,
});
