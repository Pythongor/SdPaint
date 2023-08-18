import { createAction } from "typesafe-actions";
import { AudioActions as Actions, AudioSignalType } from "./types";

export const setAudioEnabled = createAction(Actions.setAudioEnabled)<
  boolean | "switch"
>();

export const setAudioReady = createAction(Actions.setAudioReady)<boolean>();

export const setAudioSignalType = createAction(
  Actions.setAudioSignalType
)<AudioSignalType>();

const actions = {
  setAudioEnabled,
  setAudioReady,
  setAudioSignalType,
};

export default actions;
