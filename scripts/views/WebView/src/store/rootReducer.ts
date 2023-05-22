import { createReducer } from "typesafe-actions";
import { ActionType, StateType } from "./types";
import {
  setIsErasing,
  setBrushWidth,
  setCnProgress,
  setImageViewerActive,
  setResultImage,
  setPaintImage,
  setCnConfig,
} from "./actions";

const initialState: Readonly<StateType> = {
  isImageViewerActive: false,
  isErasing: false,
  brushWidth: 2,
  cnProgress: 0,
  resultImage: "",
  paintImage: "",
  cnConfig: {
    seed: -1,
    prompt: "dark unexplored dungeon",
    negative_prompt: "",
    steps: 15,
    cfg_scale: 7,
    batch_size: 1,
    models: ["control_v11p_sd15_scribble"],
    model: "control_v11p_sd15_scribble",
    modules: ["none"],
    module: "none",
  },
};

export default createReducer<StateType, ActionType>(initialState)
  .handleAction(setIsErasing, (state, { payload }) => ({
    ...state,
    isErasing: payload,
  }))
  .handleAction(setBrushWidth, (state, { payload }) => ({
    ...state,
    brushWidth: payload,
  }))
  .handleAction(setCnProgress, (state, { payload }) => ({
    ...state,
    cnProgress: payload,
  }))
  .handleAction(setImageViewerActive, (state, { payload }) => ({
    ...state,
    isImageViewerActive: payload,
  }))
  .handleAction(setResultImage, (state, { payload }) => ({
    ...state,
    resultImage: payload,
  }))
  .handleAction(setPaintImage, (state, { payload }) => ({
    ...state,
    paintImage: payload,
  }))
  .handleAction(setCnConfig, (state, { payload }) => ({
    ...state,
    cnConfig: { ...state.cnConfig, ...payload },
  }));
