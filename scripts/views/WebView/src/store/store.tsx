import { createStore, applyMiddleware, Middleware } from "redux";
import { StateType, Actions } from "./types";
import { syncStorageConfig, syncSettings } from "storage";
import { state2config, state2settings } from "./selectors";
import reducer from "./rootReducer";

const customMiddleWare: Middleware<{}, StateType> =
  (store) => (dispatch) => (action) => {
    dispatch(action);
    const currentState = store.getState();
    if (action.type === Actions.setCnConfig) {
      const config = state2config(currentState);
      syncStorageConfig(config);
    } else if (
      [Actions.setInstantGenerationMode, Actions.setZenMode].includes(
        action.type
      )
    ) {
      const settings = state2settings(currentState);
      syncSettings(settings);
    }
  };

export const store = createStore(reducer, applyMiddleware(customMiddleWare));
