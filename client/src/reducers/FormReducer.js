import {
  SET_VALUES,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_VALID,
  SET_INVALID,
  NEXT_STEP,
  PREV_STEP,
} from "./types";

export default function FormReducer(state, action) {
  switch (action.type) {
    case SET_VALUES:
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload,
        },
      };
    case SET_ERRORS:
      return {
        ...state,
        isValid: false,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
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
    case NEXT_STEP:
      return {
        ...state,
        currentStep: state.currentStep + 1,
        isValid: false,
        errors: {},
      };
    case PREV_STEP:
      return {
        ...state,
        currentStep: state.currentStep - 1,
        isValid: true,
      };
    default:
      return state;
  }
}
