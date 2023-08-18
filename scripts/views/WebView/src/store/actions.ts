import { createAction } from "typesafe-actions";
import { Actions, ModalType, PopupType } from "./types";

export const setScrollTop = createAction(Actions.setScrollTop)<number>();

export const setZenMode = createAction(Actions.setZenMode)<
  boolean | "switch"
>();

export const setModal = createAction(Actions.setModal)<ModalType>();

export const setInstantGenerationMode = createAction(
  Actions.setInstantGenerationMode
)<boolean | "switch">();

export const addPopup = createAction(Actions.addPopup)<{
  message: string;
  popupType?: PopupType;
}>();

export const deletePopup = createAction(Actions.deletePopup)<number>();

const actions = {
  setModal,
  setZenMode,
  setScrollTop,
  setInstantGenerationMode,
  addPopup,
  deletePopup,
};

export default actions;
