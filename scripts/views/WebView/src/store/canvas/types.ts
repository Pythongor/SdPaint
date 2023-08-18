import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type CanvasStateType = {
  imagesStack: string[];
  currentImageIndex: number;
  size: [number, number];
  emptyImage: string;
};

export enum CanvasActions {
  setCanvasImage = "CANVAS__SET_IMAGE",
  setCanvasWidth = "CANVAS__SET_WIDTH",
  setCanvasHeight = "CANVAS__SET_HEIGHT",
  increaseCanvasImageIndex = "CANVAS__INCREASE_IMAGE_INDEX",
  decreaseCanvasImageIndex = "CANVAS__DECREASE_IMAGE_INDEX",
  setEmptyImage = "CANVAS__SET_EMPTY_IMAGE",
}

export type CanvasActionType = ActType<typeof actions>;
