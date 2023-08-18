import { createReducer } from "typesafe-actions";
import { BrushActionType, BrushStateType } from "./types";
import actions from "./actions";

const initialState: Readonly<BrushStateType> = {
  isErasingByMouse: false,
  isErasingBySwitch: false,
  width: 2,
  brushType: "pencil",
  withFill: false,
};

export default createReducer<BrushStateType, BrushActionType>(initialState)
  .handleAction(actions.setErasingBySwitch, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        isErasingBySwitch: !state.isErasingBySwitch,
      };
    return { ...state, isErasingBySwitch: payload };
  })
  .handleAction(actions.setErasingByMouse, (state, { payload }) => {
    return { ...state, isErasingByMouse: payload };
  })
  .handleAction(actions.setBrushWidth, (state, { payload }) => {
    if (["ellipse", "rectangle"].includes(state.brushType) && state.withFill)
      return state;
    if (payload === "-") {
      return {
        ...state,
        width: Math.max(1, state.width - 1),
      };
    } else if (payload === "+")
      return {
        ...state,
        width: Math.min(10, state.width + 1),
      };
    return {
      ...state,
      width: payload,
    };
  })
  .handleAction(actions.setBrushType, (state, { payload }) => {
    return { ...state, brushType: payload };
  })
  .handleAction(actions.setBrushFilling, (state, { payload }) => {
    if (
      !["ellipse", "rectangle"].includes(state.brushType) ||
      state.isErasingBySwitch ||
      state.isErasingByMouse
    )
      return state;
    if (payload === "switch")
      return {
        ...state,
        withFill: !state.withFill,
      };
    return {
      ...state,
      withFill: payload,
    };
  });
