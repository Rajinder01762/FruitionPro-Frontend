import {
  STRIPE_PAYMENT_STATUS,
  GET_FREE_TRAIL_PLAN,
} from "../../../store/actionTypes";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import {
  SET_CARD_NUMBER_COMPLETED,
  SET_CARD_NUMBER_ERROR,
  SET_EXPIRY_DATE_COMPLETED,
  SET_EXPIRY_DATE_ERROR,
  SET_CVV_ERROR,
  SET_CVV_COMPLETED,
  SET_CARD_BRAND,
  SET_STRIPE_INFO,
  CLEAR_PAYMENT_DETAILS,
} from "./types";
import Modal from "../../../util/index";

const initialState = {
  isPaymentSuccess: false,
  paymentStatus: null,
  paymentError: null,
  stripeCompleted: false,
  cardNumberError: null,
  cardNumberCompleted: false,
  cardExpiryCompleted: false,
  cardExpiryError: null,
  cardCvcCompleted: false,
  cardCvcError: null,
  cardEndingNr: null,
  cardType: null,
  stripePaymentStatus: false,
  errors: false,
  stripeToken: null,
  srcClientSecret: null,
  cardEndingNr: null,
  stripeMethod: null,
  data: null,
};
// threeDSecurePayload.source.id,
//   threeDSecurePayload.source.redirect.url,
//   stripePayload.source.id
const PaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case STRIPE_PAYMENT_STATUS.SUCCESS: {
      const { status, message } = action.payload.data;

      if (status === 200) {
        return {
          ...state,
          isPaymentSuccess: true,
          paymentStatus: message,
          stripePaymentStatus: true,
        };
      } else {
        return {
          ...state,
          paymentStatus: message,
          stripePaymentStatus: true,
        };
      }
    }
    case SET_CARD_NUMBER_COMPLETED:
      return {
        ...state,
        cardNumberCompleted: action.data,
      };
    case SET_CARD_NUMBER_ERROR:
      return {
        ...state,
        cardNumberError: action.data,
      };
    case SET_EXPIRY_DATE_COMPLETED:
      return {
        ...state,
        cardExpiryCompleted: action.data,
      };
    case SET_EXPIRY_DATE_ERROR:
      return {
        ...state,
        cardExpiryError: action.data,
      };
    case SET_CVV_ERROR:
      return {
        ...state,
        cardCvcError: action.data,
      };
    case SET_CVV_COMPLETED:
      return {
        ...state,
        cardCvcCompleted: action.data,
      };
    case SET_CARD_BRAND:
      return {
        ...state,
        cardType: action.data,
      };
    case SET_STRIPE_INFO:
      return {
        ...state,
        stripeToken: action.data.source.id,
        stripeSrcClientSecret: action.data.source.client_secret,
        cardEndingNr: action.data.card.last4,
        cardType: action.data.card.brand.split(" ").join(""),
      };
    case CLEAR_PAYMENT_DETAILS: {
      return initialState;
    }
    case GET_FREE_TRAIL_PLAN.SUCCESS: {
      const { status, message } = action.payload.data;
      if (status === 304) {
        Modal(status, message);
      }
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

export default composeResetReducer(PaymentReducer, initialState);
