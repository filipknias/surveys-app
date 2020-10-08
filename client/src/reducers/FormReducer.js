import {
  SET_VALUES,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_VALID,
  SET_INVALID,
  NEXT_STEP,
  PREV_STEP,
  START_LOADING,
  STOP_LOADING,
  RESET_VALUES,
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
    case RESET_VALUES:
      return {
        ...state,
        currentStep: 1,
        values: {
          title: "",
          description: "",
          status: "public",
          expirationDate: {
            date: null,
            hour: null,
            minute: null,
            formattedDate: null,
          },
          multipleAnswers: false,
          answers: [
            {
              id: 1,
              value: "",
            },
            {
              id: 2,
              value: "",
            },
          ],
        },
      };
    default:
      return state;
  }
}
