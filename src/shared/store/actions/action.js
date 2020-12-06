import configureStore from "../store";
import { SET_IS_LOADING, RESET_STORE } from "../actionTypes";

async function getHeaderData(data) {
  const header = {
    "Content-Type": "application/json",
  };

  if (data.payload.request.isAuthToken) {
    const state = await configureStore();

    if (state && state.getState().sessionReducer) {
      const { auth_token } = state.getState().sessionReducer;

      header["X-Auth-Token"] = auth_token;

      return header;
    }
  }
  return header;
}

export const action = (definition) => {
  const data = {
    ...definition,
  };
  if (data && data.payload && data.payload.request) {
    const header = data.payload.request.headers || {};
    const basicHeader = getHeaderData(definition);
    const updatedHeader = {
      ...basicHeader,
      ...header,
    };
    data.payload.request.headers = updatedHeader;
  }
  return data;
};

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});
export const resetStore = () => ({ type: RESET_STORE });
