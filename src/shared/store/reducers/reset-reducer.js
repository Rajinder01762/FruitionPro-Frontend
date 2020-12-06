import storage from "redux-persist/lib/storage";
import { RESET_STORE } from "../actionTypes";

/**
 * Add a reset to store state for given reducer
 * @param reducer
 * @param initialState - value we are resetting to
 * @returns composedReducer - Higher order function
 */
export const composeResetReducer = (reducer, initialState) => (
  state,
  action
) => {
  if (action.type === RESET_STORE) {
    console.log("composeResetReducercomposeResetReducer", initialState);
    storage.removeItem("persist:root");
    return initialState;
  }
  return reducer(state, action);
};
