import {
  STRIPE_PAYMENT_STATUS,
  GET_FREE_TRAIL_PLAN,
} from "../../../store/actionTypes";
import { action } from "../../../store/actions/action";
import {
  SET_CARD_NUMBER_COMPLETED,
  SET_EXPIRY_DATE_COMPLETED,
  SET_EXPIRY_DATE_ERROR,
  SET_CVV_COMPLETED,
  SET_CVV_ERROR,
  SET_CARD_BRAND,
  SET_CARD_NUMBER_ERROR,
  SET_STRIPE_INFO,
  CLEAR_PAYMENT_DETAILS,
} from "./types";

export const stripePaymentStatus = (body) =>
  action({
    types: [STRIPE_PAYMENT_STATUS.REQUEST, STRIPE_PAYMENT_STATUS.SUCCESS],
    payload: {
      request: {
        url: "license/payment",
        data: body,
        method: "POST",
      },
    },
  });

export const getFreeTrailPlan = (body) =>
  action({
    types: [GET_FREE_TRAIL_PLAN.REQUEST, GET_FREE_TRAIL_PLAN.SUCCESS],
    payload: {
      request: {
        url: "license/trial",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const setCardNumberCompleted = (value) => {
  return {
    type: SET_CARD_NUMBER_COMPLETED,
    data: value,
  };
};
export const setCardNumberError = (text) => {
  return {
    type: SET_CARD_NUMBER_ERROR,
    data: text,
  };
};
export const setCardExpiryCompleted = (value) => {
  return {
    type: SET_EXPIRY_DATE_COMPLETED,
    data: value,
  };
};
export const setCardExpiryError = (text) => {
  return {
    type: SET_EXPIRY_DATE_ERROR,
    data: text,
  };
};
export const setCardCvvCompleted = (value) => {
  return {
    type: SET_CVV_COMPLETED,
    data: value,
  };
};
export const setCardCvvError = (text) => {
  return {
    type: SET_CVV_ERROR,
    data: text,
  };
};
export const setCardType = (value) => {
  return {
    type: SET_CARD_BRAND,
    data: value,
  };
};
export const setStripeInfo = (data) => ({
  type: SET_STRIPE_INFO,
  data,
});

export const clearPaymentDetails = () => ({
  type: CLEAR_PAYMENT_DETAILS,
});
