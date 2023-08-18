import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type CnConfigType = {
  seed: number;
  prompt: string;
  negative_prompt: string;
  steps: number;
  cfg_scale: number;
  batch_size: number;
  model: string;
  models: string[];
  module: string;
  modules: string[];
  tiling: boolean;
};

export type ControlNetStateType = Readonly<{
  config: CnConfigType;
  progress: number;
}>;

export enum ControlNetActions {
  setCnConfig = "CONTROL_NET__SET_CONFIG",
  setCnProgress = "CONTROL_NET__SET_PROGRESS",
}

export type ControlNetActionType = ActType<typeof actions>;
