import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type CnConfigType = {
  seed: number;
  prompt: string;
  negative_prompt: string;
  steps: number;
  cfg_scale: number;
  batch_size: number;
  model: string;
  models: string[];
  module: string;
  modules: string[];
};

export type StateType = {
  isErasing: boolean;
  brushWidth: number;
  cnProgress: number;
  isImageViewerActive: boolean;
  resultImage: string;
  paintImage: string;
  cnConfig: CnConfigType;
};

export enum Actions {
  setIsErasing = "SET_IS_ERASING",
  setBrushWidth = "SET_BRUSH_WIDTH",
  setCnProgress = "SET_CONTROL_NET_PROGRESS",
  setImageViewerActive = "SET_IMAGE_VIEWER_ACTIVE",
  setResultImage = "SET_RESULT_IMAGE",
  setPaintImage = "SET_PAINT_IMAGE",
  setCnConfig = "SET_CONTROL_NET_CONFIG",
}

export type ActionType = ActType<typeof actions>;
