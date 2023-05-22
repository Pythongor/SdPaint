import { createStore, applyMiddleware, Middleware } from "redux";
import { StateType, Actions } from "./types";
import { syncConfig } from "storage";
import { state2config } from "./selectors";
import reducer from "./rootReducer";

const customMiddleWare: Middleware<{}, StateType> =
  (store) => (dispatch) => (action) => {
    dispatch(action);
    if (action.type === Actions.setCnConfig) {
      const currentState = store.getState();
      const config = state2config(currentState);
      syncConfig(config);
    }
  };

export const store = createStore(reducer, applyMiddleware(customMiddleWare));
