import { createAction } from "typesafe-actions";
import { BrushActions as Actions, BrushType } from "./types";

export const setErasingBySwitch = createAction(Actions.setErasingBySwitch)<
  boolean | "switch"
>();

export const setErasingByMouse = createAction(
  Actions.setErasingByMouse
)<boolean>();

export const setBrushWidth = createAction(Actions.setBrushWidth)<
  number | "-" | "+"
>();

export const setBrushType = createAction(Actions.setBrushType)<BrushType>();

export const setBrushFilling = createAction(Actions.setBrushFilling)<
  boolean | "switch"
>();

const actions = {
  setErasingBySwitch,
  setErasingByMouse,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
};

export default actions;
