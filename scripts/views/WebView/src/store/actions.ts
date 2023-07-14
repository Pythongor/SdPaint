import { createAction } from "typesafe-actions";
import {
  Actions,
  CnConfigType,
  BrushType,
  AudioSignalType,
  ModalType,
} from "./types";

export const setScrollTop = createAction(Actions.setScrollTop)<number>();

export const setErasingBySwitch = createAction(Actions.setErasingBySwitch)<
  boolean | "switch"
>();

export const setErasingByMouse = createAction(
  Actions.setErasingByMouse
)<boolean>();

export const setBrushWidth = createAction(Actions.setBrushWidth)<
  number | "-" | "+"
>();

export const setBrushType = createAction(Actions.setBrushType)<BrushType>();

export const setBrushFilling = createAction(Actions.setBrushFilling)<
  boolean | "switch"
>();

export const setCnProgress = createAction(Actions.setCnProgress)<number>();

export const setZenMode = createAction(Actions.setZenMode)<
  boolean | "switch"
>();

export const setModal = createAction(Actions.setModal)<ModalType>();

export const setResultImage = createAction(Actions.setResultImage)<string>();

export const setPaintImage = createAction(Actions.setPaintImage)<string>();

export const setEmptyImage = createAction(Actions.setEmptyImage)<string>();
export const increasePaintImageIndex = createAction(
  Actions.increasePaintImageIndex
)();

export const decreasePaintImageIndex = createAction(
  Actions.decreasePaintImageIndex
)();

export const setCnConfig = createAction(Actions.setCnConfig)<
  Partial<CnConfigType>
>();

export const setInstantGenerationMode = createAction(
  Actions.setInstantGenerationMode
)<boolean | "switch">();

export const setAudioEnabled = createAction(Actions.setAudioEnabled)<
  boolean | "switch"
>();

export const setAudioReady = createAction(Actions.setAudioReady)<boolean>();

export const setAudioSignalType = createAction(
  Actions.setAudioSignalType
)<AudioSignalType>();

export const setCanvasWidth = createAction(Actions.setCanvasWidth)<number>();

export const setCanvasHeight = createAction(Actions.setCanvasHeight)<number>();

export const setResultWidth = createAction(Actions.setResultWidth)<number>();

export const setResultHeight = createAction(Actions.setResultHeight)<number>();

export default {
  setErasingBySwitch,
  setErasingByMouse,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
  setCnProgress,
  setModal,
  setZenMode,
  setResultImage,
  setPaintImage,
  setEmptyImage,
  increasePaintImageIndex,
  decreasePaintImageIndex,
  setCnConfig,
  setScrollTop,
  setInstantGenerationMode,
  setAudioEnabled,
  setAudioReady,
  setAudioSignalType,
  setCanvasWidth,
  setCanvasHeight,
  setResultWidth,
  setResultHeight,
};
