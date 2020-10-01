import {
  SET_VALUES,
  SET_VALID,
  SET_INVALID,
  START_LOADING,
  STOP_LOADING,
} from "./types";

export default function SurveyReducer(state, action) {
  switch (action.type) {
    case SET_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    case SET_VALID:
      return {
        ...state,
        isValid: true,
      };
    case SET_INVALID:
      return {
        ...state,
        isValid: false,
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
