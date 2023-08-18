import { createAction } from "typesafe-actions";
import { ViewerActions as Actions } from "./types";

export const setViewedImageIndex = createAction(
  Actions.setViewedImageIndex
)<number>();

export const setInputImageViewOpacity = createAction(
  Actions.setInputImageViewOpacity
)<number | "switch">();

export const setTilingViewMode = createAction(
  Actions.setTilingViewMode
)<boolean>();

const actions = {
  setViewedImageIndex,
  setInputImageViewOpacity,
  setTilingViewMode,
};

export default actions;
