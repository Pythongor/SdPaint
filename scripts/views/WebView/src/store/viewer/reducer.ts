import { createReducer } from "typesafe-actions";
import { ViewerActionType, ViewerStateType } from "./types";
import actions from "./actions";

const initialState: Readonly<ViewerStateType> = {
  viewedImageIndex: 0,
  inputImageOpacity: 0,
  withTiling: false,
};

export default createReducer<ViewerStateType, ViewerActionType>(initialState)
  .handleAction(actions.setViewedImageIndex, (state, { payload }) => ({
    ...state,
    viewedImageIndex: payload,
  }))
  .handleAction(actions.setInputImageViewOpacity, (state, { payload }) => {
    if (payload === "switch") {
      const opacity = state.inputImageOpacity;
      return {
        ...state,
        inputImageOpacity: +(opacity < 1),
      };
    }
    return {
      ...state,
      inputImageOpacity: payload,
    };
  })
  .handleAction(actions.setTilingViewMode, (state, { payload }) => ({
    ...state,
    withTiling: payload,
  }));
