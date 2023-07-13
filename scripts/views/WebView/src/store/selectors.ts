import { StateType } from "./types";
import { ConfigType, SettingsType, getStorageConfig } from "storage";

const brushWidthMap = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50];

export const getRealBrushWidth = ({ brushWidth }: StateType) =>
  brushWidthMap[brushWidth - 1];

export const getPaintImage = ({
  currentPaintImageIndex,
  paintImagesStack,
}: StateType) => paintImagesStack[currentPaintImageIndex];

export const getErasingState = ({
  isErasingByMouse,
  isErasingBySwitch,
}: StateType) => isErasingByMouse || isErasingBySwitch;

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
  canvasSize,
}: StateType): ConfigType => {
  const config = getStorageConfig();
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
    width: canvasSize[0],
    height: canvasSize[1],
  };
};

export const state2settings = ({
  instantGenerationMode,
  isZenModeOn,
  audio: { isEnabled, signalType },
  canvasSize,
}: StateType): SettingsType => ({
  instantMode: instantGenerationMode,
  zenMode: isZenModeOn,
  audioEnabled: isEnabled,
  audioSignalType: signalType,
  canvasSize,
});
