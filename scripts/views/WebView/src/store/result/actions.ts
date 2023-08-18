import { createAction } from "typesafe-actions";
import { ResultActions as Actions, ResultInfoType } from "./types";

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

const actions = {
  setResultImages,
  setResultWidth,
  setResultHeight,
  setMultipleImagesMode,
  setResultImagesCount,
  setResultInfo,
};

export default actions;
