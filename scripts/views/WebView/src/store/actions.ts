import { createAction } from "typesafe-actions";
import {
  Actions,
  CnConfigType,
  BrushType,
  AudioSignalType,
  ModalType,
  ResultInfoType,
  PopupType,
} from "./types";

// audio
export const setAudioEnabled = createAction(Actions.setAudioEnabled)<
  boolean | "switch"
>();

export const setAudioReady = createAction(Actions.setAudioReady)<boolean>();

export const setAudioSignalType = createAction(
  Actions.setAudioSignalType
)<AudioSignalType>();

// brush
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

// canvas
export const setCanvasImage = createAction(Actions.setCanvasImage)<string>();

export const setEmptyImage = createAction(Actions.setEmptyImage)<string>();

export const increaseCanvasImageIndex = createAction(
  Actions.increaseCanvasImageIndex
)();

export const decreaseCanvasImageIndex = createAction(
  Actions.decreaseCanvasImageIndex
)();

export const setCanvasWidth = createAction(Actions.setCanvasWidth)<number>();

export const setCanvasHeight = createAction(Actions.setCanvasHeight)<number>();

// result
export const setResultImages = createAction(Actions.setResultImages)<
  string[]
>();

export const setResultWidth = createAction(Actions.setResultWidth)<number>();

export const setResultHeight = createAction(Actions.setResultHeight)<number>();

export const setResultImagesCount = createAction(
  Actions.setResultImagesCount
)<number>();

export const setResultInfo = createAction(
  Actions.setResultInfo
)<ResultInfoType | null>();

export const setMultipleImagesMode = createAction(
  Actions.setMultipleImagesMode
)<boolean | "switch">();

//viewer
export const setViewedImageIndex = createAction(
  Actions.setViewedImageIndex
)<number>();

export const setInputImageViewOpacity = createAction(
  Actions.setInputImageViewOpacity
)<number | "switch">();

export const setTilingViewMode = createAction(
  Actions.setTilingViewMode
)<boolean>();

// other
export const setScrollTop = createAction(Actions.setScrollTop)<number>();

export const setCnProgress = createAction(Actions.setCnProgress)<number>();

export const setZenMode = createAction(Actions.setZenMode)<
  boolean | "switch"
>();

export const setModal = createAction(Actions.setModal)<ModalType>();

export const setCnConfig = createAction(Actions.setCnConfig)<
  Partial<CnConfigType>
>();

export const setInstantGenerationMode = createAction(
  Actions.setInstantGenerationMode
)<boolean | "switch">();

export const addPopup = createAction(Actions.addPopup)<{
  message: string;
  popupType?: PopupType;
}>();

export const deletePopup = createAction(Actions.deletePopup)<number>();

const actions = {
  setAudioEnabled,
  setAudioReady,
  setAudioSignalType,
  setErasingBySwitch,
  setErasingByMouse,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
  setCanvasImage,
  setEmptyImage,
  increaseCanvasImageIndex,
  decreaseCanvasImageIndex,
  setCanvasWidth,
  setCanvasHeight,
  setResultImages,
  setResultWidth,
  setResultHeight,
  setMultipleImagesMode,
  setResultImagesCount,
  setResultInfo,
  setViewedImageIndex,
  setInputImageViewOpacity,
  setTilingViewMode,
  setCnProgress,
  setModal,
  setZenMode,
  setCnConfig,
  setScrollTop,
  setInstantGenerationMode,
  addPopup,
  deletePopup,
};

export default actions;
