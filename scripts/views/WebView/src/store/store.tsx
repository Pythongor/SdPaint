import { configureStore, Middleware } from "@reduxjs/toolkit";
import { StateType, Actions, ActionType as RootActionType } from "./types";
import { AudioActions, AudioActionType } from "./audio/types";
import { BrushActionType } from "./brush/types";
import { CanvasActions, CanvasActionType } from "./canvas/types";
import { ControlNetActions, ControlNetActionType } from "./controlNet/types";
import { ResultActions, ResultActionType } from "./result/types";
import { ViewerActionType } from "./viewer/types";
import { setCnConfig } from "./controlNet/actions";
import { syncStorageConfig, syncSettings } from "storage";
import { state2config, state2settings } from "./selectors";
import reducer from "./reducer";
import { PayloadActionCreator } from "typesafe-actions";

type ActionType =
  | RootActionType
  | AudioActionType
  | BrushActionType
  | CanvasActionType
  | ControlNetActionType
  | ResultActionType
  | ViewerActionType;

type ActionTriggerMapType = {
  [key in ActionType["type"]]?: {
    actionCreator: PayloadActionCreator<ActionType["type"], any>;
    getPayload: (state: StateType, payload?: any) => any;
  };
};

const SYNC_CONFIG_TRIGGERS: ActionType["type"][] = [
  ControlNetActions.setCnConfig,
  CanvasActions.setCanvasWidth,
  CanvasActions.setCanvasHeight,
  ResultActions.setMultipleImagesMode,
  ResultActions.setResultImagesCount,
];

const SYNC_SETTINGS_TRIGGERS: ActionType["type"][] = [
  Actions.setInstantGenerationMode,
  Actions.setZenMode,
  AudioActions.setAudioEnabled,
  AudioActions.setAudioSignalType,
  CanvasActions.setCanvasWidth,
  CanvasActions.setCanvasHeight,
  ResultActions.setResultImagesCount,
  ResultActions.setMultipleImagesMode,
];

const actionTriggersMap: ActionTriggerMapType = {
  [ResultActions.setResultImagesCount]: {
    actionCreator: setCnConfig,
    getPayload: (
      {
        result: { isMultipleImagesModeOn },
        controlNet: {
          config: { batch_size },
        },
      },
      payload
    ) => ({ batch_size: isMultipleImagesModeOn ? payload : batch_size }),
  },
  [ResultActions.setMultipleImagesMode]: {
    actionCreator: setCnConfig,
    getPayload: (
      { result: { isMultipleImagesModeOn, imagesCount } },
      payload
    ) => {
      if (payload === "switch")
        return { batch_size: isMultipleImagesModeOn ? 1 : imagesCount };
      return { batch_size: payload ? imagesCount : 1 };
    },
  },
};

const customMiddleWare: Middleware<{}, StateType> =
  (store) => (dispatch) => (action: ActionType) => {
    if (action.type in actionTriggersMap && "payload" in action) {
      const { actionCreator, getPayload } = actionTriggersMap[action.type]!;
      const payload = getPayload(store.getState(), action.payload);
      console.log(action.type, payload);
      const triggeredAction = actionCreator(payload);
      dispatch(triggeredAction);
    }
    dispatch(action);
    const currentState = store.getState();
    if (SYNC_CONFIG_TRIGGERS.includes(action.type)) {
      const config = state2config(currentState);
      syncStorageConfig(config);
    }
    if (SYNC_SETTINGS_TRIGGERS.includes(action.type)) {
      const settings = state2settings(currentState);
      syncSettings(settings);
    }
  };

export const store = configureStore({
  reducer,
  middleware: [customMiddleWare],
});
