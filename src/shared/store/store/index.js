// @flow

import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas";
import { rootReducer } from "../reducers/index";
import logger from "redux-logger";
import axiosMiddleware from "redux-axios-middleware";
import client from "../../../api/index";
import { setIsLoading } from "../actions/action";
import { resetStore } from "../actions/action";
import notificationManager from "../../util/index";
import { composeWithDevTools } from "redux-devtools-extension";
const persistConfig = {
  key: "root",
  storage,
};

const isPublicRoute = (url) => {
  const publicRoutes = [
    "user/create",
    "user/forgot-password",
    "user/verify-forgot-password",
    "user/verify-email",
    "user/reset-password",
    "auth/login",
    "auth/social-login",
    "meeting/attendance",
    "org-user/verify-token",
    "user/resend-verification-email",
    // "user/user-type",
    "meeting/invite-meeting-token",
  ];

  return publicRoutes.includes(url);
};
const options = {
  // not required, but use-full configuration option
  returnRejectedPromiseOnError: true,
  interceptors: {
    request: [
      ({ getState, dispatch }, config) => {
        // Request interception
        const { authToken } = getState().sessionReducer;
        config.headers.common["operation"] = isPublicRoute(config.url)
          ? "public"
          : "private";
        config.headers.common["Authorization"] = `Bearer ${authToken}`;

        dispatch(setIsLoading(true));
        return config;
      },
    ],
    response: [
      {
        success: ({ dispatch }, response) => {
          dispatch(setIsLoading(false));
          // Response interception
          if (response.data && response.data.status === 401) {
            const isSessionExpired = localStorage.getItem("isSessionExpired");
            if (!isSessionExpired) {
              const id = notificationManager(
                response.data.status,
                response.data.message
              );
              localStorage.setItem("isSessionExpired", id);
            }
            setTimeout(() => {
              localStorage.clear();
              dispatch(resetStore());
            }, 1000);
          }
          return response;
        },
        error: ({ dispatch }, error) => {
          // Response Error Interception

          dispatch(setIsLoading(false));
          return Promise.reject(error);
        },
      },
    ],
  },
};

const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducer);

let middleWare = composeWithDevTools(
  applyMiddleware(axiosMiddleware(client, options), sagaMiddleware, logger)
);

//export const store = createStore(persistedReducer,middleWare);

export default function configureStore() {
  // use desired middlewares

  return new Promise((resolve, reject) => {
    try {
      const store = createStore(
        persistedReducer,
        undefined,
        compose(middleWare)
      );

      persistStore(store, null, () => resolve(store));
      sagaMiddleware.run(rootSaga);
    } catch (e) {
      reject(e);
    }
  });
}

// persistStore(store, null, () => {
//   // eslint-disable-next-line no-console
//   // console.log({ name: 'Persisted state', value: store.getState() });
// });
