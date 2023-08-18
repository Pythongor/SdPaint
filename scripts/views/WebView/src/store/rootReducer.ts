import { createReducer } from "typesafe-actions";
import { combineReducers, Reducer, CombinedState } from "@reduxjs/toolkit";
import { ActionType, RootStateType, StateType } from "./types";
import { default as audioReducer } from "./audio/reducer";
import { default as brushReducer } from "./brush/reducer";
import { default as canvasReducer } from "./canvas/reducer";
import { default as controlNetReducer } from "./controlNet/reducer";
import { default as resultReducer } from "./result/reducer";
import { default as viewerReducer } from "./viewer/reducer";
import actions from "./actions";

const initialState: Readonly<RootStateType> = {
  scrollTop: 0,
  modal: null,
  isZenModeOn: false,
  popups: [],
  instantGenerationMode: true,
};

const rootReducer = createReducer<RootStateType, ActionType>(initialState)
  .handleAction(actions.setScrollTop, (state, { payload }) => ({
    ...state,
    scrollTop: payload,
  }))
  .handleAction(actions.setModal, (state, { payload }) => {
    return { ...state, modal: payload };
  })
  .handleAction(actions.setZenMode, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        isZenModeOn: !state.isZenModeOn,
        scrollTop: state.scrollTop + 0.01,
      };
    return {
      ...state,
      isZenModeOn: payload,
      scrollTop: state.scrollTop + 0.01,
    };
  })
  .handleAction(actions.setInstantGenerationMode, (state, { payload }) => {
    if (payload === "switch")
      return { ...state, instantGenerationMode: !state.instantGenerationMode };
    return { ...state, instantGenerationMode: payload };
  })
  .handleAction(actions.addPopup, (state, { payload }) => ({
    ...state,
    popups: [
      ...state.popups,
      { ...payload, id: Math.random(), popupType: payload.popupType || "info" },
    ],
  }))
  .handleAction(actions.deletePopup, (state, { payload }) => {
    const newPopups = [...state.popups].filter((popup) => popup.id !== payload);
    return { ...state, popups: newPopups };
  });

const reducer: Reducer<CombinedState<StateType>> = combineReducers({
  root: rootReducer,
  brush: brushReducer,
  audio: audioReducer,
  canvas: canvasReducer,
  controlNet: controlNetReducer,
  result: resultReducer,
  viewer: viewerReducer,
});

export default reducer;
