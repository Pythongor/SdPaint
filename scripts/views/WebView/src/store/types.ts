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

export type BrushType = "pencil" | "line" | "rectangle" | "ellipse";

export type StateType = {
  scrollTop: number;
  isErasing: boolean;
  brushWidth: number;
  brushType: BrushType;
  withBrushFill: boolean;
  cnProgress: number;
  isImageViewerActive: boolean;
  isZenModeOn: boolean;
  resultImage: string;
  paintImagesStack: string[];
  emptyImage: string;
  currentPaintImageIndex: number;
  cnConfig: CnConfigType;
  instantGenerationMode: boolean;
};

export enum Actions {
  setIsErasing = "SET_IS_ERASING",
  setBrushWidth = "SET_BRUSH_WIDTH",
  setBrushType = "SET_BRUSH_TYPE",
  setBrushFilling = "SET_BRUSH_FILLING",
  setCnProgress = "SET_CONTROL_NET_PROGRESS",
  setImageViewerActive = "SET_IMAGE_VIEWER_ACTIVE",
  setZenMode = "SET_ZEN_MODE",
  setResultImage = "SET_RESULT_IMAGE",
  setPaintImage = "SET_PAINT_IMAGE",
  setEmptyImage = "SET_EMPTY_IMAGE",
  increasePaintImageIndex = "INCREASE_PAINT_IMAGE_INDEX",
  decreasePaintImageIndex = "DECREASE_PAINT_IMAGE_INDEX",
  setCnConfig = "SET_CONTROL_NET_CONFIG",
  setScrollTop = "SET_SCROLL_TOP",
  setInstantGenerationMode = "SET_INSTANT_GENERATION_MODE",
}

export type ActionType = ActType<typeof actions>;
