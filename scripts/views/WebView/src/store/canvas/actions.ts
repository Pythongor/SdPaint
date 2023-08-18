import { createAction } from "typesafe-actions";
import { CanvasActions as Actions } from "./types";

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

const actions = {
  setCanvasImage,
  setEmptyImage,
  increaseCanvasImageIndex,
  decreaseCanvasImageIndex,
  setCanvasWidth,
  setCanvasHeight,
};

export default actions;
