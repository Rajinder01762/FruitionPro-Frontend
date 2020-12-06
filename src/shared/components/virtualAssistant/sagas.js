import { fork, take, put, call, select } from "redux-saga/effects";
import { TEST, CREATE_MEETING_VA } from "./constants";
import {serve} from './service';

function* watchTest() {
  while (true) {
    try {
        yield take(TEST);
      console.log("here in saga")
    } catch (err) {
        console.log(err);
    }
  }
}

const getToken = state => state.sessionReducer.authToken;

function* watchCreateMeetingVA() {
  while (true) {
    try {
      const {data} = yield take(CREATE_MEETING_VA);
      const token = yield select(getToken);
      const res = yield call(serve.createMeeting, data, token);
      console.log(res);
      console.log("here in saga", data);
    } catch (err) {
        console.log(err);
    }
  }
}

export default function* root() {
  yield fork(watchTest);
  yield fork(watchCreateMeetingVA);
}