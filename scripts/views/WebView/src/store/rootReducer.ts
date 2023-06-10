import { createReducer } from "typesafe-actions";
import { ActionType, StateType } from "./types";
import actions from "./actions";

const initialState: Readonly<StateType> = {
  scrollTop: 0,
  isImageViewerActive: false,
  isErasing: false,
  brushWidth: 2,
  brushType: "pencil",
  withBrushFill: false,
  cnProgress: 0,
  resultImage: "",
  paintImage: "",
  instantGenerationMode: true,
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
  .handleAction(actions.setIsErasing, (state, { payload }) => ({
    ...state,
    isErasing: payload,
  }))
  .handleAction(actions.setScrollTop, (state, { payload }) => ({
    ...state,
    scrollTop: payload,
  }))
  .handleAction(actions.setBrushWidth, (state, { payload }) => ({
    ...state,
    brushWidth: payload,
  }))
  .handleAction(actions.setBrushType, (state, { payload }) => ({
    ...state,
    brushType: payload,
  }))
  .handleAction(actions.setBrushFilling, (state, { payload }) => ({
    ...state,
    withBrushFill: payload,
  }))
  .handleAction(actions.setCnProgress, (state, { payload }) => ({
    ...state,
    cnProgress: payload,
  }))
  .handleAction(actions.setImageViewerActive, (state, { payload }) => ({
    ...state,
    isImageViewerActive: payload,
  }))
  .handleAction(actions.setResultImage, (state, { payload }) => ({
    ...state,
    resultImage: payload,
  }))
  .handleAction(actions.setPaintImage, (state, { payload }) => ({
    ...state,
    paintImage: payload,
  }))
  .handleAction(actions.setCnConfig, (state, { payload }) => ({
    ...state,
    cnConfig: { ...state.cnConfig, ...payload },
  }))
  .handleAction(actions.setInstantGenerationMode, (state, { payload }) => ({
    ...state,
    instantGenerationMode: payload,
  }));
