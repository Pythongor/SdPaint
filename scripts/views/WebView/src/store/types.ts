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

export type ModalType = "imageViewer" | "settings" | null;

export type BrushType = "pencil" | "line" | "rectangle" | "ellipse";

export type AudioSignalType = "epic" | "ringtone" | "bounce";

export type AudioConfigType = {
  isEnabled: boolean;
  isReady: boolean;
  signalType: AudioSignalType;
};

export type BrushConfigType = {
  isErasingBySwitch: boolean;
  isErasingByMouse: boolean;
  width: number;
  brushType: BrushType;
  withFill: boolean;
};

export type ResultConfigType = {
  images: string[];
  imageSize: [number, number];
  viewedImageIndex: number;
  imagesCount: number;
  isMultipleImagesModeOn: boolean;
};

export type CanvasConfigType = {
  imagesStack: string[];
  currentImageIndex: number;
  size: [number, number];
  emptyImage: string;
};

export type StateType = Readonly<{
  brushConfig: Readonly<BrushConfigType>;
  scrollTop: number;
  cnProgress: number;
  modal: ModalType;
  isZenModeOn: boolean;
  canvas: Readonly<CanvasConfigType>;
  result: Readonly<ResultConfigType>;
  cnConfig: Readonly<CnConfigType>;
  instantGenerationMode: boolean;
  audio: Readonly<AudioConfigType>;
}>;

export enum Actions {
  setErasingBySwitch = "SET_BRUSH_ERASING_BY_SWITCH",
  setErasingByMouse = "SET_BRUSH_ERASING_BY_MOUSE",
  setBrushWidth = "SET_BRUSH_WIDTH",
  setBrushType = "SET_BRUSH_TYPE",
  setBrushFilling = "SET_BRUSH_FILLING",
  setCnProgress = "SET_CONTROL_NET_PROGRESS",
  setModal = "SET_MODAL",
  setZenMode = "SET_ZEN_MODE",
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
  setCanvasWidth = "SET_CANVAS_WIDTH",
  setCanvasHeight = "SET_CANVAS_HEIGHT",
  setResultWidth = "SET_RESULT_WIDTH",
  setResultHeight = "SET_RESULT_HEIGHT",
  setResultImages = "SET_RESULT_IMAGES",
}

export type ActionType = ActType<typeof actions>;
