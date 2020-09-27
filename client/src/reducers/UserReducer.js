import {
  SET_USER,
  CLEAR_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  START_LOADING,
  STOP_LOADING,
} from "./types";

export default function (state, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: {
          ...action.payload,
        },
        isAuth: true,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: {},
        isAuth: false,
      };
    case SET_ERRORS:
      return {
        ...state,
        errors: {
          ...action.payload,
        },
        isAuth: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: {},
      };
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
