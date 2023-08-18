import { createReducer } from "typesafe-actions";
import { ControlNetStateType, ControlNetActionType } from "./types";
import actions from "./actions";

const initialState: Readonly<ControlNetStateType> = {
  progress: 0,
  config: {
    seed: -1,
    prompt: "dark unexplored dungeon",
    negative_prompt: "",
    steps: 15,
    cfg_scale: 7,
    batch_size: 1,
    tiling: false,
    models: ["control_v11p_sd15_scribble"],
    model: "control_v11p_sd15_scribble",
    modules: ["none"],
    module: "none",
  },
};

const reducer = createReducer<ControlNetStateType, ControlNetActionType>(
  initialState
)
  .handleAction(actions.setCnProgress, (state, { payload }) => ({
    ...state,
    progress: payload,
  }))
  .handleAction(actions.setCnConfig, (state, { payload }) => ({
    ...state,
    config: { ...state.config, ...payload },
  }));

export default reducer;
