import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type ViewerStateType = {
  viewedImageIndex: number;
  inputImageOpacity: number;
  withTiling: boolean;
};

export enum ViewerActions {
  setViewedImageIndex = "VIEWER__SET_VIEWED_IMAGE_INDEX",
  setInputImageViewOpacity = "VIEWER__SET_INPUT_IMAGE_VIEW_OPACITY",
  setTilingViewMode = "VIEWER__SET_TILING_VIEW_MODE",
}

export type ViewerActionType = ActType<typeof actions>;
