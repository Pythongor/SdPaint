import { createAction } from "typesafe-actions";
import { Actions, CnConfigType, BrushType } from "./types";

export const setScrollTop = createAction(Actions.setScrollTop)<number>();

export const setIsErasing = createAction(Actions.setIsErasing)<
  boolean | "switch"
>();

export const setBrushWidth = createAction(Actions.setBrushWidth)<
  number | "-" | "+"
>();

export const setBrushType = createAction(Actions.setBrushType)<BrushType>();

export const setBrushFilling = createAction(Actions.setBrushFilling)<
  boolean | "switch"
>();

export const setCnProgress = createAction(Actions.setCnProgress)<number>();

export const setImageViewerActive = createAction(
  Actions.setImageViewerActive
)<boolean>();

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

export default {
  setIsErasing,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
  setCnProgress,
  setImageViewerActive,
  setResultImage,
  setPaintImage,
  setEmptyImage,
  increasePaintImageIndex,
  decreasePaintImageIndex,
  setCnConfig,
  setScrollTop,
  setInstantGenerationMode,
};
