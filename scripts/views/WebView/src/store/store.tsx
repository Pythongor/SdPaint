import { createStore, applyMiddleware, Middleware } from "redux";
import { StateType, Actions } from "./types";
import { syncStorageConfig, syncSettings } from "storage";
import { state2config, state2settings } from "./selectors";
import reducer from "./rootReducer";

const SYNC_CONFIG_TRIGGERS = [
  Actions.setCnConfig,
  Actions.setCanvasWidth,
  Actions.setCanvasHeight,
  Actions.setMultipleImagesMode,
  Actions.setResultImagesCount,
];

const SYNC_SETTINGS_TRIGGERS = [
  Actions.setInstantGenerationMode,
  Actions.setZenMode,
  Actions.setAudioEnabled,
  Actions.setAudioSignalType,
  Actions.setCanvasWidth,
  Actions.setCanvasHeight,
  Actions.setResultImagesCount,
  Actions.setMultipleImagesMode,
];

const customMiddleWare: Middleware<{}, StateType> =
  (store) => (dispatch) => (action) => {
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

export const store = createStore(reducer, applyMiddleware(customMiddleWare));
