import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type AudioSignalType = "epic" | "ringtone" | "bounce";

export type AudioStateType = {
  isEnabled: boolean;
  isReady: boolean;
  signalType: AudioSignalType;
};

export enum AudioActions {
  setAudioEnabled = "AUDIO__SET_ENABLED",
  setAudioReady = "AUDIO_SET__READY",
  setAudioSignalType = "AUDIO__SET_SIGNAL_TYPE",
}

export type AudioActionType = ActType<typeof actions>;
