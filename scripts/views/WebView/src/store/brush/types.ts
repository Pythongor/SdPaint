import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type BrushType = "pencil" | "line" | "rectangle" | "ellipse";

export type BrushStateType = {
  isErasingBySwitch: boolean;
  isErasingByMouse: boolean;
  width: number;
  brushType: BrushType;
  withFill: boolean;
};

export enum BrushActions {
  setErasingBySwitch = "BRUSH__SET_ERASING_BY_SWITCH",
  setErasingByMouse = "BRUSH__SET_ERASING_BY_MOUSE",
  setBrushWidth = "BRUSH__SET_WIDTH",
  setBrushType = "BRUSH__SET_TYPE",
  setBrushFilling = "BRUSH__SET_FILLING",
}

export type BrushActionType = ActType<typeof actions>;
