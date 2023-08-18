import { createReducer } from "typesafe-actions";
import { AudioActionType, AudioStateType } from "./types";
import actions from "./actions";

const initialState: Readonly<AudioStateType> = {
  isEnabled: false,
  isReady: false,
  signalType: "ringtone",
};

const reducer = createReducer<AudioStateType, AudioActionType>(initialState)
  .handleAction(actions.setAudioEnabled, (state, { payload }) => {
    if (payload === "switch") return { ...state, isEnabled: !state.isEnabled };
    return { ...state, isEnabled: payload };
  })
  .handleAction(actions.setAudioReady, (state, { payload }) => ({
    ...state,
    isReady: payload,
  }))
  .handleAction(actions.setAudioSignalType, (state, { payload }) => ({
    ...state,
    signalType: payload,
  }));

export default reducer;
