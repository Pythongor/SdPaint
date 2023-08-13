import { StateType } from "./types";
import { ConfigType, SettingsType, getStorageConfig } from "storage";

const brushWidthMap = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50];

export const getRealBrushWidth = ({ brushConfig: { width } }: StateType) =>
  brushWidthMap[width - 1];

export const getCanvasImage = ({
  canvas: { currentImageIndex, imagesStack },
}: StateType) => imagesStack[currentImageIndex];

export const getErasingState = ({
  brushConfig: { isErasingByMouse, isErasingBySwitch },
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
    tiling,
  },
  canvas: { size },
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
    tiling,
    controlnet_units: [{ ...firstUnit, module, model }],
    width: size[0],
    height: size[1],
  };
};

export const state2settings = ({
  instantGenerationMode,
  isZenModeOn,
  audio: { isEnabled, signalType },
  canvas: { size },
  result: { imagesCount, isMultipleImagesModeOn },
}: StateType): SettingsType => ({
  instantMode: instantGenerationMode,
  zenMode: isZenModeOn,
  audioEnabled: isEnabled,
  audioSignalType: signalType,
  canvasSize: size,
  isMultipleImagesModeOn,
  resultImagesCount: imagesCount,
});
