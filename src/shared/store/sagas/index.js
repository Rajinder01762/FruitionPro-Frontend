import { all } from "redux-saga/effects";
import viSagas from "../../../shared/components/virtualAssistant/sagas";

export default function* rootSaga() {
  yield all([viSagas()]);
}