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
  setAudioEnabled = "AUDIO__SET_ENABLED",
  setAudioReady = "AUDIO_SET__READY",
  setAudioSignalType = "AUDIO__SET_SIGNAL_TYPE",
  setErasingBySwitch = "BRUSH__SET_ERASING_BY_SWITCH",
  setErasingByMouse = "BRUSH__SET_ERASING_BY_MOUSE",
  setBrushWidth = "BRUSH__SET_WIDTH",
  setBrushType = "BRUSH__SET_TYPE",
  setBrushFilling = "BRUSH__SET_FILLING",
  setCanvasImage = "CANVAS__SET_IMAGE",
  setCanvasWidth = "CANVAS__SET_WIDTH",
  setCanvasHeight = "CANVAS__SET_HEIGHT",
  increaseCanvasImageIndex = "CANVAS__INCREASE_IMAGE_INDEX",
  decreaseCanvasImageIndex = "CANVAS__DECREASE_IMAGE_INDEX",
  setResultWidth = "RESULT__SET_WIDTH",
  setResultHeight = "RESULT__SET_HEIGHT",
  setResultImages = "RESULT__SET_IMAGES",
  setCnProgress = "SET_CONTROL_NET_PROGRESS",
  setInstantGenerationMode = "SET_INSTANT_GENERATION_MODE",
  setModal = "SET_MODAL",
  setZenMode = "SET_ZEN_MODE",
  setEmptyImage = "SET_EMPTY_IMAGE",
  setCnConfig = "SET_CONTROL_NET_CONFIG",
  setScrollTop = "SET_SCROLL_TOP",
}

export type ActionType = ActType<typeof actions>;
