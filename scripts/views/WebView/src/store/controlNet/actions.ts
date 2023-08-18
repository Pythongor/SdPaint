import { createAction } from "typesafe-actions";
import { ControlNetActions as Actions, CnConfigType } from "./types";

export const setCnProgress = createAction(Actions.setCnProgress)<number>();

export const setCnConfig = createAction(Actions.setCnConfig)<
  Partial<CnConfigType>
>();

const actions = {
  setCnProgress,
  setCnConfig,
};

export default actions;
