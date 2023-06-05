import { createAction } from "typesafe-actions";
import { Actions, CnConfigType } from "./types";

export const setScrollTop = createAction(Actions.setScrollTop)<number>();

export const setIsErasing = createAction(Actions.setIsErasing)<boolean>();

export const setBrushWidth = createAction(Actions.setBrushWidth)<number>();

export const setCnProgress = createAction(Actions.setCnProgress)<number>();

export const setImageViewerActive = createAction(
  Actions.setImageViewerActive
)<boolean>();

export const setResultImage = createAction(Actions.setResultImage)<string>();

export const setPaintImage = createAction(Actions.setPaintImage)<string>();

export const setCnConfig = createAction(Actions.setCnConfig)<
  Partial<CnConfigType>
>();

export const setInstantGenerationMode = createAction(
  Actions.setInstantGenerationMode
)<boolean>();
