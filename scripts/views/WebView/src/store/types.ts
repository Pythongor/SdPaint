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

export type AudioSignalType = "epic" | "ringtone" | "bounce";

export type AudioConfigType = {
  isEnabled: boolean;
  isReady: boolean;
  signalType: AudioSignalType;
};

export type BrushType = "pencil" | "line" | "rectangle" | "ellipse";

export type StateType = {
  scrollTop: number;
  isErasingBySwitch: boolean;
  isErasingByMouse: boolean;
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
  audio: AudioConfigType;
};

export enum Actions {
  setErasingBySwitch = "SET_ERASING_BY_SWITCH",
  setErasingByMouse = "SET_ERASING_BY_MOUSE",
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
  setAudioEnabled = "SET_AUDIO_ENABLED",
  setAudioReady = "SET_AUDIO_READY",
  setAudioSignalType = "SET_AUDIO_SIGNAL_TYPE",
}

export type ActionType = ActType<typeof actions>;
