import { ActionType as ActType } from "typesafe-actions";
import { AudioStateType } from "./audio/types";
import { BrushStateType } from "./brush/types";
import { CanvasStateType } from "./canvas/types";
import { ControlNetStateType } from "./controlNet/types";
import { ResultStateType } from "./result/types";
import { ViewerStateType } from "./viewer/types";
import * as actions from "./actions";

export type ModalType = "imageViewer" | "settings" | null;

export type PopupType = "info" | "success" | "warning" | "error";

export type PopupConfigType = {
  message: string;
  popupType: PopupType;
  id: number;
};

export type RootStateType = Readonly<{
  instantGenerationMode: boolean;
  isZenModeOn: boolean;
  modal: ModalType;
  popups: PopupConfigType[];
  scrollTop: number;
}>;

export type StateType = Readonly<{
  root: RootStateType;
  viewer: ViewerStateType;
  brush: BrushStateType;
  audio: AudioStateType;
  canvas: CanvasStateType;
  controlNet: ControlNetStateType;
  result: ResultStateType;
}>;

export enum Actions {
  setInstantGenerationMode = "SET_INSTANT_GENERATION_MODE",
  setModal = "SET_MODAL",
  setScrollTop = "SET_SCROLL_TOP",
  setZenMode = "SET_ZEN_MODE",
  addPopup = "ADD_POPUP",
  deletePopup = "DELETE_POPUP",
}

export type ActionType = ActType<typeof actions>;
